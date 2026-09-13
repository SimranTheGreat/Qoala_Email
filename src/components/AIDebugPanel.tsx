type AIDebugPanelProps = {
  rawResponse: unknown;
  error: string | null;
  loading: boolean;
  streaming: boolean;
  onRetry: () => void;
};

export default function AIDebugPanel({
  rawResponse,
  error,
  loading,
  streaming,
  onRetry,
}: AIDebugPanelProps) {
  return (
    <div className="mt-6 border-t pt-5">
      <p className="mb-2 text-sm font-semibold">Raw AI JSON</p>

      <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-xs text-white">
        {rawResponse
          ? JSON.stringify(rawResponse, null, 2)
          : "No AI response yet."}
      </pre>

      {error && (
        <div className="mt-4">
          <p className="mb-1 text-sm font-semibold text-red-600">
            Validation Error
          </p>

          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onRetry}
        disabled={loading || streaming}
        className="mt-4 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Retry
      </button>
    </div>
  );
}
