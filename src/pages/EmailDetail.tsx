import { useEffect, useRef, useState } from "react";
import type { AIResponse, Email } from "../types";
import { generateAIResponse } from "../services/mockAI";
import { useAIStore } from "../store/store";
import {
  EmailControls,
  EmailHeader,
  EmailNotes,
  AIAssist,
} from "../components";

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

  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cachedResponse = useAIStore((state) => state.responses[email.id]);

  const setAIResponseCache = useAIStore((state) => state.setResponse);

  const stopStreaming = () => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsStreaming(false);
    setAILoading(false);
  };

  const streamDraft = (draft: string, signal: AbortSignal) => {
    setDraftReply("");
    setIsStreaming(true);

    let currentIndex = 0;

    streamTimerRef.current = setInterval(() => {
      if (signal.aborted) {
        if (streamTimerRef.current) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }

        setIsStreaming(false);
        return;
      }

      currentIndex += 1;

      setDraftReply(draft.slice(0, currentIndex));

      if (currentIndex >= draft.length) {
        if (streamTimerRef.current) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }

        setIsStreaming(false);
      }
    }, 25);
  };

  const getAIResponse = async () => {
    stopStreaming();

    const controller = new AbortController();

    abortControllerRef.current = controller;

    setAILoading(true);
    setAIError(null);
    setAIResponse(null);
    setRawAIResponse(null);
    setDraftReply("");

    try {
      const result = await generateAIResponse(email.id, controller.signal);

      if (controller.signal.aborted) {
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

        setAIResponseCache(email.id, result.response);

        setAILoading(false);

        streamDraft(result.response.draft_reply, controller.signal);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (controller.signal.aborted) {
        return;
      }

      setAIError("Something went wrong while generating the AI response.");

      setAILoading(false);
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    setStatus(email.status);
    setPriority(email.priority);
    setNotes("");

    stopStreaming();

    if (cachedResponse) {
      setAIResponse(cachedResponse);
      setDraftReply(cachedResponse.draft_reply);
      setAILoading(false);
      setAIError(null);
      setRawAIResponse(cachedResponse);
      return;
    }

    getAIResponse();

    return () => {
      stopStreaming();
    };
  }, [email.id]);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-full flex-col">
        <EmailHeader email={email} onClose={onClose} />

        <div className="flex-1 overflow-auto p-8">
          <EmailControls
            status={status}
            priority={priority}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
          />

          <div className="mb-8 whitespace-pre-wrap text-sm leading-7">
            {email.body}
          </div>

          <EmailNotes notes={notes} onChange={setNotes} />

          <AIAssist
            response={aiResponse}
            loading={aiLoading}
            error={aiError}
            draftReply={draftReply}
            isStreaming={isStreaming}
            debugMode={debugMode}
            rawResponse={rawAIResponse}
            onDraftChange={setDraftReply}
            onStop={stopStreaming}
            onRetry={getAIResponse}
            onDebugChange={setDebugMode}
          />
        </div>
      </div>
    </div>
  );
}
