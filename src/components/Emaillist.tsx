import data from "../data.json";
import EmailRow from "./Emailrow";

export default function EmailList() {
  return (
    <div>
      {data.map((item) => (
        <EmailRow
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}