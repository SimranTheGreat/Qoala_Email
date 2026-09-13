import type { Email } from "../types";

type EmailControlsProps = {
  status: Email["status"];
  priority: Email["priority"];
  onStatusChange: (status: Email["status"]) => void;
  onPriorityChange: (priority: Email["priority"]) => void;
};

export default function EmailControls({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: EmailControlsProps) {
  return (
    <div className="mb-6 flex gap-3">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as Email["status"])}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="New">New</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
        <option value="Draft">Draft</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as Email["priority"])}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="P1">P1</option>
        <option value="P2">P2</option>
        <option value="P3">P3</option>
      </select>
    </div>
  );
}
