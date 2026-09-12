import { useState } from "react";
import EmailRow from "./Emailrow";
import type { Email } from "../types";
import {
  useInboxEmailStore,
  useSentEmailStore,
  useDraftEmailStore,
} from "../store/store";

type EmailListProps = {
  emails: Email[];
};

export default function EmailList({ emails }: EmailListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateInboxEmail = useInboxEmailStore(
    (state) => state.updateInboxEmail,
  );

  const deleteInboxEmail = useInboxEmailStore(
    (state) => state.deleteInboxEmail,
  );

  const deleteSentEmail = useSentEmailStore((state) => state.deleteSentEmail);

  const deleteDraftEmail = useDraftEmailStore(
    (state) => state.deleteDraftEmail,
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((email) => email.id));
    }
  };

  const markSelectedDone = () => {
    selectedIds.forEach((id) => {
      updateInboxEmail(id, {
        status: "Done",
      });
    });

    setSelectedIds([]);
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => {
      const email = emails.find((email) => email.id === id);

      if (!email) return;

      if (email.folder === "inbox") {
        deleteInboxEmail(id);
      } else if (email.folder === "sent") {
        deleteSentEmail(id);
      } else if (email.folder === "draft") {
        deleteDraftEmail(id);
      }
    });

    setSelectedIds([]);
  };

  return (
    <div>
      {/* Bulk toolbar */}
      <div className="flex items-center gap-4 border-b bg-gray-50 px-5 py-3">
        <input
          type="checkbox"
          checked={emails.length > 0 && selectedIds.length === emails.length}
          onChange={selectAll}
          className="h-4 w-4"
          aria-label="Select all emails"
        />

        {selectedIds.length > 0 && (
          <>
            <span className="text-sm text-gray-600">
              {selectedIds.length} selected
            </span>

            <button
              onClick={markSelectedDone}
              className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-gray-100"
            >
              Mark Done
            </button>

            <button
              onClick={deleteSelected}
              className="rounded-lg border bg-white px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete Selected
            </button>
          </>
        )}
      </div>

      {/* Email rows */}
      {emails.map((item) => (
        <EmailRow
          key={item.id}
          item={item}
          selected={selectedIds.includes(item.id)}
          onSelect={toggleSelect}
        />
      ))}
    </div>
  );
}
