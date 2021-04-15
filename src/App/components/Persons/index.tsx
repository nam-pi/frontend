import { API_ENTRYPOINT } from "App/constants";
import { usePartialCollection } from "App/hooks/usePartialCollection";
import { Person, SearchParams } from "App/types";
import { useMemo, useState } from "react";
import { ItemNav } from "../ItemNav";
import { PersonListItem } from "../PersonListItem";

const BASE_URI = `${API_ENTRYPOINT}/persons`;

export const Persons = () => {
  const [text, setText] = useState<string>("");
  const searchParams = useMemo<SearchParams>(() => {
    const params: SearchParams = [];
    if (text) {
      params.push(["http://localhost:4000/vocab#textVariable", text]);
    }
    return params;
  }, [text]);
  const [persons, totalItems, nav] = usePartialCollection<Person>(
    BASE_URI,
    searchParams
  );
  return (
    <div>
      <h1>Persons ({totalItems})</h1>
      <div>
        Filter:{" "}
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div>
      <ul>
        {persons.map((person) => (
          <PersonListItem key={person.id} {...person} />
        ))}
      </ul>
      <ItemNav nav={nav} />
    </div>
  );
};
