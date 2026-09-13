import type { Email } from "../types";

type EmailDetailHeaderProps = {
  email: Email;
  onClose: () => void;
};

export default function EmailDetailHeader({
  email,
  onClose,
}: EmailDetailHeaderProps) {
  return (
    <div className="flex items-center gap-4 border-b px-6 py-4">
      <button
        type="button"
        onClick={onClose}
        className="text-xl text-gray-500 hover:text-gray-800"
        aria-label="Close email"
      >
        ←
      </button>

      <div>
        <h2 className="text-lg font-semibold">{email.subject}</h2>

        <div className="text-sm text-gray-500">
          {email.sender.name} · {email.sender.email}
        </div>
      </div>
    </div>
  );
}
