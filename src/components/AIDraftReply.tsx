import type { AIResponse } from "../types";

type AIDraftReplyProps = {
  response: AIResponse;
  draftReply: string;
  isStreaming: boolean;
  onDraftChange: (value: string) => void;
  onStop: () => void;
};

export default function AIDraftReply({
  response,
  draftReply,
  isStreaming,
  onDraftChange,
  onStop,
}: AIDraftReplyProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="font-medium">Draft Reply</p>

        {isStreaming && (
          <button
            type="button"
            onClick={onStop}
            className="rounded-lg border bg-white px-3 py-1 text-xs hover:bg-gray-100"
          >
            Stop
          </button>
        )}
      </div>

      <textarea
        value={draftReply}
        onChange={(e) => onDraftChange(e.target.value)}
        rows={5}
        className="w-full rounded-lg border bg-white p-3 text-sm outline-none"
      />

      {isStreaming && (
        <p className="mt-2 text-xs text-gray-500">Generating draft...</p>
      )}

      {!isStreaming &&
        draftReply.length > 0 &&
        draftReply !== response.draft_reply && (
          <p className="mt-2 text-xs text-gray-500">
            Generation stopped. The partial draft has been preserved.
          </p>
        )}
    </div>
  );
}
