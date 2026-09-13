import { useEffect, useState } from "react";
import data from "../data.json";
import { Sidebar, Toolbar, EmailList, ComposeScreen } from "../components";
import { EmailSchema } from "../types";
import {
  useSentEmailStore,
  useDraftEmailStore,
  useInboxEmailStore,
  useStarredEmailStore,
} from "../store/store";

export default function Home() {
  const [composeOpen, setComposeOpen] = useState(false);

  const [draftsOpen, setDraftsOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(true);
  const [starredOpen, setStarredOpen] = useState(false);

  const [senderFilter, setSenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const inboxEmails = useInboxEmailStore((state) => state.inboxEmails);

  const setInboxEmails = useInboxEmailStore((state) => state.setInboxEmails);

  const draftEmails = useDraftEmailStore((state) => state.draftEmails);

  const sentEmails = useSentEmailStore((state) => state.sentEmails);

  const starredEmails = useStarredEmailStore((state) => state.starredEmails);

  useEffect(() => {
    if (inboxEmails.length === 0) {
      const parsedEmails = data.map((email) =>
        EmailSchema.parse({
          ...email,
          folder: "inbox",
        }),
      );

      setInboxEmails(parsedEmails);
    }
  }, [inboxEmails.length, setInboxEmails]);

  const currentEmails = inboxOpen
    ? inboxEmails
    : draftsOpen
      ? draftEmails
      : sentOpen
        ? sentEmails
        : starredOpen
          ? starredEmails
          : [];

  const filteredEmails = currentEmails.filter((email) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      email.subject.toLowerCase().includes(searchText) ||
      email.sender.name.toLowerCase().includes(searchText) ||
      email.sender.email.toLowerCase().includes(searchText) ||
      email.body.toLowerCase().includes(searchText) ||
      email.channel.toLowerCase().includes(searchText) ||
      email.tags.some((tag) => tag.toLowerCase().includes(searchText));

    const matchesSender =
      !senderFilter ||
      email.sender.name.toLowerCase().includes(senderFilter.toLowerCase());

    const matchesStatus = !statusFilter || email.status === statusFilter;

    const matchesPriority =
      !priorityFilter || email.priority === priorityFilter;

    return matchesSearch && matchesSender && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearch("");
    setSenderFilter("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  const openInbox = () => {
    setInboxOpen(true);
    setDraftsOpen(false);
    setSentOpen(false);
    setStarredOpen(false);
  };

  const openDrafts = () => {
    setDraftsOpen(true);
    setInboxOpen(false);
    setSentOpen(false);
    setStarredOpen(false);
  };

  const openSent = () => {
    setSentOpen(true);
    setInboxOpen(false);
    setDraftsOpen(false);
    setStarredOpen(false);
  };

  const openStarred = () => {
    setStarredOpen(true);
    setInboxOpen(false);
    setDraftsOpen(false);
    setSentOpen(false);
  };

  return (
    <div className="h-screen bg-white text-gray-800">
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          onCompose={() => setComposeOpen(true)}
          onDrafts={openDrafts}
          onSent={openSent}
          onInbox={openInbox}
          onStarred={openStarred}
        />

        <main className="flex-1 overflow-auto">
          <Toolbar search={search} onSearchChange={setSearch} />

          {/* Filters */}
          {inboxOpen && (
            <div className="flex gap-3 border-b border-gray-200 p-4">
              <input
                type="text"
                placeholder="Filter by sender"
                value={senderFilter}
                onChange={(e) => setSenderFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm outline-none"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Draft">Draft</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">All Priorities</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>

              <button
                onClick={clearFilters}
                className="rounded-lg bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Email List */}
          {(inboxOpen || draftsOpen || sentOpen || starredOpen) && (
            <EmailList emails={filteredEmails} />
          )}
        </main>

        <ComposeScreen
          isOpen={composeOpen}
          onClose={() => setComposeOpen(false)}
        />
      </div>
    </div>
  );
}
