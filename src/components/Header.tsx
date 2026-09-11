type HeaderProps = {
  onRefresh: () => void;
};

export default function Header({ onRefresh }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center px-6 gap-8">
      <div className="w-52 text-xl font-medium">
        Inbox
      </div>

      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-5 h-11 w-[600px]">
        <span className="text-xl text-gray-500">⌕</span>

        <input
          type="text"
          placeholder="Search mail"
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-6 text-gray-500">
        <span>?</span>
        <span>⚙</span>

        <button
          onClick={onRefresh}
          className="hover:text-gray-800"
          title="Clear filters"
        >
          ↻
        </button>

        <span>●</span>
      </div>
    </header>
  );
}