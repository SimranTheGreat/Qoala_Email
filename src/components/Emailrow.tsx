import { useState } from "react";
import type { Email } from "../types";
import {
  useInboxEmailStore,
  useSentEmailStore,
  useDraftEmailStore,
  useStarredEmailStore,
} from "../store/store";
import EmailDetail from "../pages/EmailDetail";

type EmailRowProps = {
  item: Email;
  selected: boolean;
  onSelect: (id: string) => void;
};

export default function EmailRow({ item, selected, onSelect }: EmailRowProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const deleteInboxEmail = useInboxEmailStore(
    (state) => state.deleteInboxEmail,
  );

  const deleteSentEmail = useSentEmailStore((state) => state.deleteSentEmail);

  const deleteDraftEmail = useDraftEmailStore(
    (state) => state.deleteDraftEmail,
  );

  const toggleStarredEmail = useStarredEmailStore(
    (state) => state.toggleStarredEmail,
  );

  const isStarred = useStarredEmailStore((state) =>
    state.starredEmails.some((email) => email.id === item.id),
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (item.folder === "inbox") {
      deleteInboxEmail(item.id);
    } else if (item.folder === "sent") {
      deleteSentEmail(item.id);
    } else if (item.folder === "draft") {
      deleteDraftEmail(item.id);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(item.id);
  };

  const handleStarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleStarredEmail(item);
  };

  const receivedTime = item.received_at ?? item.sent_at ?? "—";

  return (
    <>
      <div
        onClick={() => setSelectedEmail(item)}
        className="group flex min-h-[54px] cursor-pointer items-center gap-4 border-b border-gray-100 px-5 hover:bg-gray-50"
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 shrink-0"
          aria-label={`Select ${item.subject}`}
        />

        {/* Star */}
        <button
          type="button"
          onClick={handleStarClick}
          className={`shrink-0 text-xl ${
            isStarred
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500"
          }`}
          aria-label={
            isStarred ? `Unstar ${item.subject}` : `Star ${item.subject}`
          }
        >
          {isStarred ? "★" : "☆"}
        </button>

        {/* Sender */}
        <div className="w-40 shrink-0 truncate text-sm font-medium">
          {item.sender.name}
        </div>

        {/* Subject */}
        <div className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold">{item.subject}</span>

          <span className="text-gray-500">
            {" — "}
            {item.channel}
          </span>
        </div>

        {/* Status */}
        <div className="w-28 shrink-0">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              item.status === "New"
                ? "bg-blue-100 text-blue-700"
                : item.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : item.status === "Done"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Priority */}
        <div className="w-16 shrink-0 text-center">
          <span
            className={`text-sm font-semibold ${
              item.priority === "P1"
                ? "text-red-600"
                : item.priority === "P2"
                  ? "text-orange-600"
                  : "text-gray-600"
            }`}
          >
            {item.priority}
          </span>
        </div>

        {/* Received Time */}
        <div className="w-40 shrink-0 text-right text-xs text-gray-500">
          {receivedTime}
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          className="hidden shrink-0 text-gray-500 hover:text-red-600 group-hover:block"
          aria-label="Delete email"
        >
          🗑
        </button>
      </div>

      {selectedEmail && (
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </>
  );
}
