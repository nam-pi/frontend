import { useEntityUrl } from "App/hooks/useEntityUrl";
import { namespaces } from "App/namespaces";
import { PlacesQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceDetails } from "../PlaceDetails";
import { PlaceEditor } from "../PlaceEditor";
import { PlaceholderText } from "../PlaceholderText";
import { PlacesFilterSettings } from "../PlacesFilterSettings";
import { SidebarPage } from "../SidebarPage";

export const PlacesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal, edit } = useEntityUrl();
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
          linkBase="places"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        edit ? (
          <PlaceEditor idLocal={idLocal} />
        ) : idLocal ? (
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
