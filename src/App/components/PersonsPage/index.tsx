import { usePersonLabel } from "App/hooks/usePersonLabel";
import { namespaces } from "App/namespaces";
import { Person, PersonsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { PersonDetails } from "../PersonDetails";
import { PersonsFilterSettings } from "../PersonsFilterSettings";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const PersonsPage = () => {
  const getLabel = usePersonLabel();
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
            <PersonsFilterSettings query={query} setQuery={setQuery} />
          }
          createLabel={getLabel}
          heading={formatMessage({
            description: "Person sidebar list item name",
            defaultMessage: "Persons",
          })}
          itemType={namespaces.core.person}
          linkBase="persons"
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
