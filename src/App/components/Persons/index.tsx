import { ItemType } from "App/enums/ItemType";
import { event } from "App/extractors/event";
import { usePartialCollection } from "App/hooks/usePartialCollection";
import { core, doc } from "App/namespaces";
import { Person, SearchParams } from "App/types";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router";
import { Heading } from "../Heading";
import { Input } from "../Input";
import { ItemListItem } from "../ItemListItem";
import { ItemNav } from "../ItemNav";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { PersonDetails } from "../PersonDetails";

interface Params {
  localId: undefined | string;
}

export const Persons = () => {
  const { localId } = useParams<Params>();
  const [text, setText] = useState<string>("");
  const searchParams = useMemo<SearchParams>(() => {
    const params: SearchParams = [[doc.personOrderByVariable, "label"]];
    if (text) {
      params.push([doc.textVariable, text]);
    }
    return params;
  }, [text]);
  const [initialized, persons, totalItems, nav] = usePartialCollection<Person>(
    ItemType.Person,
    searchParams,
    event("birth", core.isBornIn),
    event("death", core.diesIn)
  );
  return (
    <div>
      <div>
        <Heading>
          {initialized ? (
            <FormattedMessage
              description="Persons list heading"
              defaultMessage="Persons ({totalItems})"
              values={{ totalItems }}
            />
          ) : (
            <FormattedMessage
              description="Uninitialized persons list heading"
              defaultMessage="Persons"
            />
          )}
        </Heading>
        <div className="my-4">
          <FormattedMessage
            description="Filter label"
            defaultMessage="Filter"
          />
          <Input
            className="ml-2"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
          ></Input>
        </div>
        {initialized ? (
          <ul className="mb-4">
            {persons
              .sort((personA, personB) =>
                personA.label[0].value
                  .toLowerCase()
                  .localeCompare(personB.label[0].value.toLowerCase())
              )
              .map((person) => {
                return (
                  <ItemListItem
                    key={person.id}
                    {...person}
                    labelPs={person.birth
                      .map(({ date: d }) => {
                        const dString = d.exact
                          ? d.exact.getFullYear()
                          : d.earliest && d.latest
                          ? `${d.earliest.getFullYear()} - ${d.latest.getFullYear()}`
                          : d.earliest
                          ? d.earliest.getFullYear()
                          : d.latest
                          ? d.latest.getFullYear()
                          : "";
                        return dString ? ` (${dString})` : "";
                      })
                      .join(",")}
                  />
                );
              })}
          </ul>
        ) : (
          <LoadingPlaceholder />
        )}
        <ItemNav nav={nav} />
      </div>
      <div className="mt-4">
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
    </div>
  );
};
