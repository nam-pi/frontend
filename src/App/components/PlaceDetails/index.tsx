import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import clsx from "clsx";
import { LatLngTuple } from "leaflet";
import { EventsQuery, usePlace } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemTexts } from "../ItemTexts";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Map } from "../Map";
import { Marker } from "../Marker";

interface Props {
  idLocal: string;
}

const EventsWithPlace = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      place: id,
      orderBy: "date",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) => (old.place === id ? old : { ...old, place: id }));
  }, [id]);

  return (
    <FilterableItemList
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <EventsFilterSettings query={query} setQuery={setQuery} />
      }
      headingLevel={2}
      linkBase="events"
      heading={formatMessage({
        description: "Place events list heading",
        defaultMessage: "Events happened at this place",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const PlaceDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = usePlace({ idLocal });
  const coordinates: undefined | LatLngTuple =
    data?.latitude && data.longitude
      ? [data.latitude, data.longitude]
      : undefined;
  return data ? (
    <>
      <div
        className={clsx(
          "md:grid",
          "gap-8",
          coordinates ? "grid-cols-6" : "grid-cols-4"
        )}
      >
        <div className="col-span-4">
          <Heading>
            <FormattedMessage
              description="Place heading"
              defaultMessage="Place: {label}"
              values={{ label: getText(data.labels) }}
            />
          </Heading>
          <ItemInheritance item={data} />
          <ItemLabels item={data} />
          <ItemTexts item={data} />
          <ItemComments item={data} />
        </div>
        {coordinates && (
          <Map
            className="w-full h-64 col-span-2 mt-8 md:mt-0"
            center={coordinates}
            zoom={16}
          >
            <Marker className="text-red-500 text-3xl" position={coordinates} />
          </Map>
        )}
      </div>
      <EventsWithPlace id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
