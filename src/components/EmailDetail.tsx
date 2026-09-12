import { useEffect, useState } from "react";
import type { AIResponse, Email } from "../types";
import { generateAIResponse } from "../services/mockAI";
import { useAIStore } from "../store/store";

type EmailDetailProps = {
  email: Email;
  onClose: () => void;
};

export default function EmailDetail({ email, onClose }: EmailDetailProps) {
  const [status, setStatus] = useState(email.status);
  const [priority, setPriority] = useState(email.priority);
  const [notes, setNotes] = useState("");

  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);

  const [aiLoading, setAILoading] = useState(false);

  const [aiError, setAIError] = useState<string | null>(null);

  const [draftReply, setDraftReply] = useState("");

  const [debugMode, setDebugMode] = useState(false);

  const [rawAIResponse, setRawAIResponse] = useState<unknown>(null);

  const cachedResponse = useAIStore((state) => state.responses[email.id]);

  const setAIResponseCache = useAIStore((state) => state.setResponse);

  const getAIResponse = async (signal?: AbortSignal) => {
    setAILoading(true);
    setAIError(null);
    setAIResponse(null);

    try {
      const result = await generateAIResponse(email.id, signal);

      if (signal?.aborted) {
        return;
      }

      setRawAIResponse(result.raw ?? null);

      if (result.error) {
        setAIError(result.error);
        setAILoading(false);
        return;
      }

      if (result.response) {
        setAIResponse(result.response);
        setDraftReply(result.response.draftReply);

        setAIResponseCache(email.id, result.response);
      }

      setAILoading(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (signal?.aborted) {
        return;
      }

      setAIError("Something went wrong while generating the AI response.");

      setAILoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (cachedResponse) {
      setAIResponse(cachedResponse);
      setDraftReply(cachedResponse.draftReply);

      return () => {
        controller.abort();
      };
    }

    getAIResponse(controller.signal);

    return () => {
      controller.abort();
    };
  }, [email.id, cachedResponse, setAIResponseCache]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 border-b px-6 py-4">
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-gray-800"
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">{email.subject}</h2>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {/* Sender */}
          <div className="mb-6">
            <div className="text-base font-semibold">{email.sender.name}</div>

            <div className="text-sm text-gray-500">{email.sender.email}</div>
          </div>

          {/* Status + Priority */}
          <div className="mb-6 flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Email["status"])}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="New">New</option>

              <option value="In Progress">In Progress</option>

              <option value="Done">Done</option>

              <option value="Draft">Draft</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Email["priority"])}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </div>

          {/* Full message */}
          <div className="mb-8 whitespace-pre-wrap text-sm leading-7">
            {email.body}
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="mb-2 text-sm font-semibold">Notes</h3>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              rows={4}
              className="w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* AI Assist */}
          <div className="rounded-xl border bg-gray-50 p-5">
            {/* AI Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">AI Assist</h3>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={debugMode}
                  onChange={(e) => setDebugMode(e.target.checked)}
                />
                Debug mode
              </label>
            </div>

            {/* Loading */}
            {aiLoading && (
              <div className="text-sm text-gray-500">
                AI is analyzing this email...
              </div>
            )}

            {/* Error */}
            {aiError && !aiLoading && (
              <div className="space-y-3">
                <p className="text-sm text-red-600">{aiError}</p>

                <button
                  onClick={() => getAIResponse()}
                  className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Retry
                </button>
              </div>
            )}

            {/* AI Response */}
            {aiResponse && !aiLoading && (
              <div className="space-y-5 text-sm">
                {/* Summary */}
                <div>
                  <p className="mb-1 font-medium">Summary</p>

                  <ul className="list-disc pl-5 text-gray-600">
                    {aiResponse.summary.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Category */}
                <div>
                  <p className="font-medium">Category</p>

                  <p className="text-gray-600">{aiResponse.category}</p>
                </div>

                {/* Suggested Action */}
                <div>
                  <p className="font-medium">Suggested Action</p>

                  <p className="text-gray-600">{aiResponse.suggestedAction}</p>
                </div>

                {/* Draft Reply */}
                <div>
                  <p className="mb-1 font-medium">Draft Reply</p>

                  <textarea
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border bg-white p-3 text-sm outline-none"
                  />
                </div>
              </div>
            )}

            {/* Debug Mode */}
            {debugMode && (
              <div className="mt-6 border-t pt-5">
                <p className="mb-2 text-sm font-semibold">Raw AI JSON</p>

                <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-white">
                  {rawAIResponse
                    ? JSON.stringify(rawAIResponse, null, 2)
                    : "No AI response yet."}
                </pre>

                {aiError && (
                  <div className="mt-4">
                    <p className="mb-1 text-sm font-semibold text-red-600">
                      Validation Error
                    </p>

                    <p className="text-sm text-red-600">{aiError}</p>
                  </div>
                )}

                <button
                  onClick={() => getAIResponse()}
                  disabled={aiLoading}
                  className="mt-4 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
