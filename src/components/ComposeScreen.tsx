import { useState } from "react";
import { useDraftEmailStore, useSentEmailStore } from "../store/store";
import { EmailSchema } from "../types";
type ComposeProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ComposeScreen({ isOpen, onClose }: ComposeProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const addSentEmail = useSentEmailStore(
    (state) => state.addSentEmail
  );

  const addDraftEmail = useDraftEmailStore(
    (state) => state.addDraftEmail
  );

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
    onClose();
  };

  const parseRecipient = () => {
    const value = to.trim();

    const match = value.match(/^(.+?)\s*<([^<>]+)>$/);

    if (match) {
      return {
        name: match[1].trim(),
        email: match[2].trim(),
      };
    }

    return {
      name: "",
      email: value,
    };
  };

  const handleSend = () => {
    if (!to.trim()) {
      alert("Please enter a recipient.");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter a subject.");
      return;
    }

    if (!body.trim()) {
      alert("Please enter a message.");
      return;
    }

    const recipient = parseRecipient();

    const email = {
      id: `sent_${Date.now()}`,
      folder: "sent" as const,
      sent_at: new Date().toISOString(),

      sender: {
        name: "Support Team",
        email: "support@example.com",
      },

      recipients: [recipient],

      subject: subject.trim(),
      channel: "email" as const,
      status: "Done" as const,
      priority: "P3" as const,
      body: body.trim(),
      tags: [],
    };

    const result = EmailSchema.safeParse(email);

    if (!result.success) {
      alert("Please enter a valid recipient email address.");
      console.error(result.error);
      return;
    }

    addSentEmail(result.data);

    resetForm();
  };

  const handleClose = () => {
    if (!to.trim() && !subject.trim() && !body.trim()) {
      resetForm();
      return;
    }

    const recipient = parseRecipient();

    const draft = {
      id: `draft_${Date.now()}`,
      folder: "draft" as const,
      received_at: new Date().toISOString(),

      sender: {
        name: "Support Team",
        email: "support@example.com",
      },

      recipients: recipient.email
        ? [recipient]
        : [],

      subject: subject.trim(),
      channel: "email" as const,
      status: "Draft" as const,
      priority: "P3" as const,
      body: body.trim(),
      tags: [],
    };

    const result = EmailSchema.safeParse(draft);

    if (!result.success) {
      console.error("Invalid draft:", result.error);
      return;
    }

    addDraftEmail(result.data);

    resetForm();
  };

  const handleDiscard = () => {
    resetForm();
  };

  return (
    <>
     

      {isOpen && (
        <div className="fixed bottom-0 right-8 z-50 w-[520px] overflow-hidden rounded-t-xl bg-white shadow-2xl ring-1 ring-gray-200">

          <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">
              New Message
            </h2>

            <button
              onClick={handleClose}
              aria-label="Close compose"
              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="px-4">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipients"
              className="w-full border-b py-3 text-sm outline-none"
            />

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border-b py-3 text-sm outline-none"
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={12}
              className="w-full resize-none py-4 text-sm outline-none"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handleSend}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Send
            </button>

            <button
              onClick={handleDiscard}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </>
  );
}