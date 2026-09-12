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
  const cachedResponse = useAIStore((state) => state.responses[email.id]);
  const setAIResponseCache = useAIStore((state) => state.setResponse);

  useEffect(() => {
    const getAIResponse = async () => {
      if (cachedResponse) {
        setAIResponse(cachedResponse);
        setDraftReply(cachedResponse.draftReply);
        return;
      }

      setAILoading(true);
      setAIError(null);
      setAIResponse(null);

      const result = await generateAIResponse(email.id);

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
    };

    getAIResponse();
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
          <div className="mb-6">
            <div className="text-base font-semibold">{email.sender.name}</div>

            <div className="text-sm text-gray-500">{email.sender.email}</div>
          </div>

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

          <div className="mb-8 whitespace-pre-wrap text-sm leading-7">
            {email.body}
          </div>

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

          <div className="rounded-xl border bg-gray-50 p-5">
            <h3 className="mb-4 text-sm font-semibold">AI Assist</h3>

            {aiLoading && (
              <p className="text-sm text-gray-500">
                AI is analyzing this email...
              </p>
            )}

            {aiError && <div className="text-sm text-red-600">{aiError}</div>}

            {aiResponse && !aiLoading && (
              <div className="space-y-5 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}
