import { Event, useEvents } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { EventDetails } from "../EventDetails";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const EventsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useEvents({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Event>
          linkBase="event"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Events sidebar list item name",
            defaultMessage: "Events",
          })}
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
