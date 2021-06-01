import { namespaces } from "App/namespaces";
import { PlacesQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceDetails } from "../PlaceDetails";
import { PlaceholderText } from "../PlaceholderText";
import { PlacesFilterSettings } from "../PlacesFilterSettings";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const PlacesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<PlacesQuery>({
    orderBy: "label",
    text: "",
    type: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          filterSettings={
            <PlacesFilterSettings query={query} setQuery={setQuery} />
          }
          heading={formatMessage({
            description: "Places sidebar list item name",
            defaultMessage: "Places",
          })}
          itemType={namespaces.core.place}
          linkBase="place"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        idLocal ? (
          <PlaceDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No place selected placeholder"
              defaultMessage="Please select a place"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
