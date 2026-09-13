type EmailNotesProps = {
  notes: string;
  onChange: (value: string) => void;
};

export default function EmailNotes({ notes, onChange }: EmailNotesProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-2 text-sm font-semibold">Notes</h3>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add notes..."
        rows={4}
        className="w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}
