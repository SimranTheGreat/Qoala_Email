import EmailRow from "./Emailrow";
import type { Email } from "../types";

type EmailListProps = {
  emails: Email[];
};

export default function EmailList({ emails }: EmailListProps) {
  return (
    <div>
      {emails.map((item) => (
        <EmailRow key={item.id} item={item} />
      ))}
    </div>
  );
}
