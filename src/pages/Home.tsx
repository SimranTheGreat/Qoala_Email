import { useEffect, useState } from "react";
import data from "../data.json";
import {
  Header,
  Sidebar,
  Toolbar,
  EmailList,
  ComposeScreen,
} from "../components";
import { EmailSchema } from "../types";
import {
  useSentEmailStore,
  useDraftEmailStore,
  useInboxEmailStore,
} from "../store/store";

export default function Home() {
  const [composeOpen, setComposeOpen] = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(true);

  const [senderFilter, setSenderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const inboxEmails = useInboxEmailStore((state) => state.inboxEmails);

  const setInboxEmails = useInboxEmailStore((state) => state.setInboxEmails);

  const draftEmails = useDraftEmailStore((state) => state.draftEmails);

  const sentEmails = useSentEmailStore((state) => state.sentEmails);

  // Load data.json into Zustand when the inbox is empty
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
      : sentEmails;

  const filteredEmails = currentEmails.filter((email) => {
    const matchesSender =
      !senderFilter ||
      email.sender.name.toLowerCase().includes(senderFilter.toLowerCase());

    const matchesStatus = !statusFilter || email.status === statusFilter;

    const matchesPriority =
      !priorityFilter || email.priority === priorityFilter;

    return matchesSender && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSenderFilter("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  return (
    <div className="h-screen bg-white text-gray-800">
      <Header onRefresh={clearFilters} />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          onCompose={() => setComposeOpen(true)}
          onDrafts={() => {
            setDraftsOpen(true);
            setSentOpen(false);
            setInboxOpen(false);
          }}
          onSent={() => {
            setSentOpen(true);
            setDraftsOpen(false);
            setInboxOpen(false);
          }}
          onInbox={() => {
            setInboxOpen(true);
            setDraftsOpen(false);
            setSentOpen(false);
          }}
        />

        <main className="flex-1 overflow-auto">
          <Toolbar />

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
            </div>
          )}

          {inboxOpen && <EmailList emails={filteredEmails} />}

          {draftsOpen && <EmailList emails={filteredEmails} />}

          {sentOpen && <EmailList emails={filteredEmails} />}
        </main>

        <ComposeScreen
          isOpen={composeOpen}
          onClose={() => setComposeOpen(false)}
        />
      </div>
    </div>
  );
}
