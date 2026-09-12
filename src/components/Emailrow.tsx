import { useState } from "react";
import type { Email } from "../types";
import {
  useInboxEmailStore,
  useSentEmailStore,
  useDraftEmailStore,
  useStarredEmailStore,
} from "../store/store";
import EmailDetail from "./EmailDetail";

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

  return (
    <>
      <div
        onClick={() => setSelectedEmail(item)}
        className="group flex h-[54px] cursor-pointer items-center gap-4 border-b border-gray-100 px-5 hover:shadow-md"
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4"
          aria-label={`Select ${item.subject}`}
        />

        {/* Star */}
        <button
          type="button"
          onClick={handleStarClick}
          className={`text-xl ${
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
        <div className="w-44 shrink-0 truncate text-sm font-medium">
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

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          className="hidden text-gray-500 hover:text-red-600 group-hover:block"
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
