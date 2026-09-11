import type { Email } from "../types";
import {
  useInboxEmailStore,
  useSentEmailStore,
  useDraftEmailStore,
} from "../store/store";

type EmailRowProps = {
  item: Email;
};

export default function EmailRow({ item }: EmailRowProps) {
  const deleteInboxEmail = useInboxEmailStore(
    (state) => state.deleteInboxEmail,
  );

  const deleteSentEmail = useSentEmailStore(
    (state) => state.deleteSentEmail,
  );

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
    <div className="group h-[54px] flex items-center gap-4 px-5 border-b border-gray-100 hover:shadow-md cursor-pointer">
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

      {/* Priority */}
      <span
        className={`text-xs px-3 py-1 rounded-full shrink-0 ${
          item.priority === "P1"
            ? "bg-red-100 text-red-700"
            : item.priority === "P2"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        {item.priority}
      </span>

      {/* Status */}
      <span
        className={`text-xs px-3 py-1 rounded-full shrink-0 ${
          item.status === "New"
            ? "bg-blue-100 text-blue-700"
            : item.status === "Done"
              ? "bg-green-100 text-green-700"
              : item.status === "Draft"
                ? "bg-gray-100 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {item.status}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="hidden group-hover:block text-gray-500 hover:text-red-600"
        aria-label="Delete email"
      >
        🗑
      </button>
    </div>
  );
}