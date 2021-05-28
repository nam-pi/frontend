import { useEventDate } from "App/hooks/useEventDate";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { Event, EventsQuery } from "nampi-use-api";
import { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { EventDetails } from "../EventDetails";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { ItemTypeSelect } from "../ItemTypeSelect";
import { Label } from "../Label";
import { PlaceholderText } from "../PlaceholderText";
import { Select } from "../Select";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const EventsPage = () => {
  const getText = useLocaleLiteral();
  const getDate = useEventDate();
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<EventsQuery>({
    aspectType: "",
    orderBy: "label",
    participantType: "",
    text: "",
  });
  const getEventLabel = useCallback(
    (event: Event) => {
      const label = getText(event.labels);
      const date = getDate(event, "yearOnly");
      return date ? `${label} (${date})` : label;
    },
    [getDate, getText]
  );
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          filterSettings={
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="sort-select"
              >
                <FormattedMessage
                  description="Order by filter input label"
                  defaultMessage="Order by"
                />
              </Label>
              <Select
                className="col-span-4"
                id="sort-select"
                onChange={(v) =>
                  setQuery((q) => ({ ...q, orderBy: v.value as any }))
                }
                options={[
                  { value: "label", text: "Label" },
                  { value: "date", text: "Date" },
                ]}
                selected={query.orderBy}
              />
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="aspect-type-input"
              >
                <FormattedMessage
                  description="Used aspect type filter input label"
                  defaultMessage="Used aspect type"
                />
              </Label>
              <ItemTypeSelect
                className="col-span-4"
                id="aspect-type-input"
                onChange={(id) => setQuery((q) => ({ ...q, aspectType: id }))}
                typeBase={namespaces.core.aspect}
                typeIri={query.aspectType}
              />
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="participant-type-input"
              >
                <FormattedMessage
                  description="Used participant type filter input label"
                  defaultMessage="Used participant type"
                />
              </Label>
              <ItemTypeSelect
                className="col-span-4"
                id="participant-type-input"
                onChange={(id) =>
                  setQuery((q) => ({ ...q, participantType: id }))
                }
                typeBase={namespaces.core.agent}
                typeIri={query.participantType}
              />
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="text-input"
              >
                <FormattedMessage
                  description="Event text filter input label"
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
          linkBase="event"
          itemName={formatMessage({
            description: "Events sidebar list item name",
            defaultMessage: "Events",
          })}
          itemType={namespaces.core.event}
          createLabel={getEventLabel}
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
