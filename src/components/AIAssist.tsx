import type { AIResponse } from "../types";
import AISummary from "./AISummary";
import AIDraftReply from "./AIDraftReply";
import AIDebugPanel from "./AIDebugPanel";

type AIAssistProps = {
  response: AIResponse | null;
  loading: boolean;
  error: string | null;

  draftReply: string;
  isStreaming: boolean;

  debugMode: boolean;
  rawResponse: unknown;

  onDraftChange: (value: string) => void;
  onStop: () => void;
  onRetry: () => void;
  onDebugChange: (value: boolean) => void;
};

export default function AIAssist({
  response,
  loading,
  error,
  draftReply,
  isStreaming,
  debugMode,
  rawResponse,
  onDraftChange,
  onStop,
  onRetry,
  onDebugChange,
}: AIAssistProps) {
  return (
    <div className="rounded-xl border bg-gray-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI Assist</h3>

        <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => onDebugChange(e.target.checked)}
          />
          Debug mode
        </label>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">
          AI is analyzing this email...
        </div>
      )}

      {error && !loading && (
        <div className="space-y-3">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      )}

      {response && !loading && (
        <div className="space-y-5 text-sm">
          <AISummary response={response} />

          <AIDraftReply
            response={response}
            draftReply={draftReply}
            isStreaming={isStreaming}
            onDraftChange={onDraftChange}
            onStop={onStop}
          />
        </div>
      )}

      {debugMode && (
        <AIDebugPanel
          rawResponse={rawResponse}
          error={error}
          loading={loading}
          streaming={isStreaming}
          onRetry={onRetry}
        />
      )}
    </div>
  );
}
