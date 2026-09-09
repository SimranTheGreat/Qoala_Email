import data from "../data.json";
type SidebarProps = {
  onCompose: () => void;
};
export default function Sidebar({ onCompose }: SidebarProps) {
  return (
    <aside className="w-60 border-r border-gray-200 p-4">
      <button
        className="bg-blue-100 hover:bg-blue-200 rounded-2xl px-6 py-3 mb-5 text-sm font-medium"
        onClick={onCompose}
      >
        ＋ Compose
      </button>

      <nav className="space-y-1">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-r-full bg-blue-100 font-semibold text-sm">
          <span>📥</span>
          <span>Inbox</span>
          <span className="ml-auto">
            {data.length}
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer">
          <span>⭐</span>
          <span>Starred</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer">
          <span>🕐</span>
          <span>Snoozed</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer">
          <span>📤</span>
          <span>Sent</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer">
          <span>📝</span>
          <span>Drafts</span>
        </div>
      </nav>
    </aside>
  );
}