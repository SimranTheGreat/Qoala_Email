import { useState } from "react";
import type { Email } from "../types";
import {
  useInboxEmailStore,
  useSentEmailStore,
  useDraftEmailStore,
} from "../store/store";
import EmailDetail from "./EmailDetail";

type EmailRowProps = {
  item: Email;
};

export default function EmailRow({ item }: EmailRowProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const deleteInboxEmail = useInboxEmailStore(
    (state) => state.deleteInboxEmail,
  );

  const deleteSentEmail = useSentEmailStore((state) => state.deleteSentEmail);

  const deleteDraftEmail = useDraftEmailStore(
    (state) => state.deleteDraftEmail,
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

  return (
    <>
      <div
        onClick={() => setSelectedEmail(item)}
        className="group h-[54px] flex items-center gap-4 px-5 border-b border-gray-100 hover:shadow-md cursor-pointer"
      >
        <input
          type="checkbox"
          className="w-4 h-4"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          className="text-xl text-gray-400 hover:text-yellow-500"
          onClick={(e) => e.stopPropagation()}
        >
          ☆
        </button>

        <div className="w-44 shrink-0 font-medium text-sm truncate">
          {item.sender.name}
        </div>

        <div className="flex-1 min-w-0 text-sm truncate">
          <span className="font-semibold">{item.subject}</span>

          <span className="text-gray-500">
            {" — "}
            {item.channel}
          </span>
        </div>

        {/* priority */}

        {/* status */}

        <button
          onClick={handleDelete}
          className="hidden group-hover:block text-gray-500 hover:text-red-600"
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
