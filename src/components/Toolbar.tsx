type ToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function Toolbar({ search, onSearchChange }: ToolbarProps) {
  return (
    <div className="flex items-center border-b px-5 py-3">
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search emails..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>

        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
