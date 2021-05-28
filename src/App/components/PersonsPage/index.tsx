import { useEventDate } from "App/hooks/useEventDate";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { Person, PersonsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { ItemTypeSelect } from "../ItemTypeSelect";
import { Label } from "../Label";
import { PersonDetails } from "../PersonDetails";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const PersonsPage = () => {
  const getDate = useEventDate();
  const getText = useLocaleLiteral();
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<PersonsQuery>({
    orderBy: "label",
    text: "",
    type: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList<Person>
          activeItem={idLocal}
          filterSettings={
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label className="col-span-2" htmlFor="type-input">
                <FormattedMessage
                  description="Person type filter input label"
                  defaultMessage="Person type"
                />
              </Label>
              <ItemTypeSelect
                className="col-span-4"
                id="type-input"
                onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
                typeBase={namespaces.core.person}
                typeIri={query.type}
              />
              <Label className="col-span-2" htmlFor="text-input">
                <FormattedMessage
                  description="Person text filter input label"
                  defaultMessage="Text"
                />
              </Label>
              <Input
                className="col-span-4"
                id="text-input"
                value={query.text}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, text: e.target.value }))
                }
              />
            </div>
          }
          createLabel={(person) => {
            const label = getText(person.labels);
            const born = getDate(person.bornIn?.[0], "yearOnly");
            return (
              label +
              (born
                ? ` ${formatMessage(
                    {
                      description: "Person birth name",
                      defaultMessage: "(born {birth})",
                    },
                    {
                      birth: `${born}${
                        (person.bornIn?.length || 0) > 1 ? "[...]" : ""
                      }`,
                    }
                  )} `
                : "")
            );
          }}
          itemName={formatMessage({
            description: "Person sidebar list item name",
            defaultMessage: "Persons",
          })}
          itemType={namespaces.core.person}
          linkBase="person"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        idLocal ? (
          <PersonDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No person selected placeholder"
              defaultMessage="Please select a person"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
