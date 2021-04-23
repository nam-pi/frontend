import { ItemType } from "App/enums/ItemType";
import { usePartialCollection } from "App/hooks/usePartialCollection";
import { doc } from "App/namespaces";
import { Person, SearchParams } from "App/types";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router";
import { ItemListItem } from "../ItemListItem";
import { ItemNav } from "../ItemNav";
import { PersonDetails } from "../PersonDetails";

interface Params {
  localId: undefined | string;
}

export const Persons = () => {
  const { localId } = useParams<Params>();
  const [text, setText] = useState<string>("");
  const searchParams = useMemo<SearchParams>(() => {
    const params: SearchParams = [];
    if (text) {
      params.push([doc.textVariable, text]);
    }
    return params;
  }, [text]);
  const [persons, totalItems, nav] = usePartialCollection<Person>(
    ItemType.Person,
    searchParams
  );
  return (
    <div>
      <div>
        <h1>
          <FormattedMessage
            description="Persons list heading"
            defaultMessage="Persons ({totalItems})"
            values={{ totalItems }}
          />
        </h1>
        <div>
          <FormattedMessage
            description="Filter label"
            defaultMessage="Filter"
          />
          {""}
          <input value={text} onChange={(e) => setText(e.target.value)}></input>
        </div>
        <ul>
          {persons.map((person) => (
            <ItemListItem key={person.id} {...person} />
          ))}
        </ul>
        <ItemNav nav={nav} />
      </div>
      {localId ? (
        <PersonDetails localId={localId} />
      ) : (
        <span>
          <FormattedMessage
            description="Empty placeholder text"
            defaultMessage="No person selected"
          />
        </span>
      )}
    </div>
  );
};
