import {
  useInboxEmailStore,
  useDraftEmailStore,
  useSentEmailStore,
  useStarredEmailStore,
} from "../store/store";

type SidebarProps = {
  onCompose: () => void;
  onDrafts: () => void;
  onSent: () => void;
  onInbox: () => void;
  onStarred: () => void;
};

export default function Sidebar({
  onCompose,
  onDrafts,
  onSent,
  onInbox,
  onStarred,
}: SidebarProps) {
  const inboxEmails = useInboxEmailStore((state) => state.inboxEmails);

  const draftEmails = useDraftEmailStore((state) => state.draftEmails);

  const sentEmails = useSentEmailStore((state) => state.sentEmails);

  const starredEmails = useStarredEmailStore((state) => state.starredEmails);

  return (
    <aside className="w-60 border-r border-gray-200 p-4">
      <button
        className="bg-blue-100 hover:bg-blue-200 rounded-2xl px-6 py-3 mb-5 text-sm font-medium"
        onClick={onCompose}
      >
        ＋ Compose
      </button>

      <nav className="space-y-1">
        <div
          onClick={onInbox}
          className="flex items-center gap-3 px-4 py-2.5 rounded-r-full bg-blue-100 font-semibold text-sm cursor-pointer"
        >
          <span>📥</span>
          <span>Inbox</span>
          <span className="ml-auto">{inboxEmails.length}</span>
        </div>

        <div
          onClick={onStarred}
          className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer"
        >
          <span>⭐</span>
          <span>Starred</span>
          <span className="ml-auto">{starredEmails.length}</span>
        </div>

        <div
          onClick={onSent}
          className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer"
        >
          <span>📤</span>
          <span>Sent</span>
          <span className="ml-auto">{sentEmails.length}</span>
        </div>

        <div
          onClick={onDrafts}
          className="flex items-center gap-3 px-4 py-2.5 rounded-r-full hover:bg-gray-100 text-sm cursor-pointer"
        >
          <span>📝</span>
          <span>Drafts</span>
          <span className="ml-auto">{draftEmails.length}</span>
        </div>
      </nav>
    </aside>
  );
}
