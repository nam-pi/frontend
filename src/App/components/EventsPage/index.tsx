import { useEntityUrl } from "App/hooks/useEntityUrl";
import { useEventLabel } from "App/hooks/useEventLabel";
import { namespaces } from "App/namespaces";
import { EventsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EventDetails } from "../EventDetails";
import { EventEditor } from "../EventEditor";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

export const EventsPage = () => {
  const getLabel = useEventLabel();
  const { formatMessage } = useIntl();
  const { idLocal, edit } = useEntityUrl();
  const [query, setQuery] = useState<EventsQuery>({
    aspectType: "",
    orderBy: "date",
    participantType: "",
    endDate: undefined,
    startDate: undefined,
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
          linkBase="events"
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
        edit ? (
          <EventEditor idLocal={idLocal} />
        ) : idLocal ? (
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
