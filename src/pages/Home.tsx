import { useState } from "react";
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
  const inboxEmails = data.map((email) =>
    EmailSchema.parse({
      ...email,
      folder: "inbox",
    }),
  );
  const draftEmails = useDraftEmailStore((state) => state.draftEmails);
  const sentEmails = useSentEmailStore((state) => state.sentEmails);
  return (
    <div className="h-screen bg-white text-gray-800">
      <Header />

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
          {inboxOpen && <EmailList emails={inboxEmails} />}
          {draftsOpen && <EmailList emails={draftEmails} />}
          {sentOpen && <EmailList emails={sentEmails} />}
        </main>
        <ComposeScreen
          isOpen={composeOpen}
          onClose={() => setComposeOpen(false)}
        />
      </div>
    </div>
  );
}
