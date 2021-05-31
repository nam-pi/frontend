import { useEventLabel } from "App/hooks/useEventLabel";
import { namespaces } from "App/namespaces";
import { EventsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { EventDetails } from "../EventDetails";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const EventsPage = () => {
  const getLabel = useEventLabel();
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<EventsQuery>({
    aspectType: "",
    orderBy: "label",
    participantType: "",
    text: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          filterSettings={
            <EventsFilterSettings query={query} setQuery={setQuery} />
          }
          linkBase="event"
          heading={formatMessage({
            description: "Events sidebar list item name",
            defaultMessage: "Events",
          })}
          itemType={namespaces.core.event}
          createLabel={getLabel}
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        idLocal ? (
          <EventDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No event selected placeholder"
              defaultMessage="Please select an event"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
