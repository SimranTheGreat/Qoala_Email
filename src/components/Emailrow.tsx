type Email = {
  id: string;
  subject: string;
  channel: string;
  status: string;
  sender: {
    name: string;
    email: string;
  };
};

type EmailRowProps = {
  item: Email;
};

export default function EmailRow({ item }: EmailRowProps) {
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
        <span className="font-semibold">
          {item.subject}
        </span>

        <span className="text-gray-500">
          {" — "}
          {item.channel}
        </span>
      </div>

      <span
        className={`text-xs px-3 py-1 rounded-full shrink-0 ${
          item.status === "New"
            ? "bg-blue-100 text-blue-700"
            : item.status === "Closed"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {item.status}
      </span>

      <button className="hidden group-hover:block text-gray-500">
        🗑
      </button>
    </div>
  );
}