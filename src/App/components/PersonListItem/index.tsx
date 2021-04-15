import { Person } from "App/types";

export const PersonListItem = ({ id, label }: Person) => (
  <li key={id}>
    <a href={id}>
      {label
        .map((l) => `${l.value}${l.language ? ` [${l.language}]` : ""}`)
        .join(", ")}
    </a>
  </li>
);
