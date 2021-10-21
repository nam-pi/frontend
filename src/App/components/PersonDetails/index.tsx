import {
    faBullseye,
    faEdit,
    faMapMarker
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useCompletePlaces } from "App/hooks/useCompletePlaces";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import clsx from "clsx";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import {
    Event,
    EventsQuery,
    useAuth,
    useEvents,
    usePerson
} from "nampi-use-api";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { MapConsumer } from "react-leaflet";
import { Link } from "react-router-dom";
import { DeleteButton } from "../DeleteButton";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemLink } from "../ItemLink";
import { ItemSameAs } from "../ItemSameAs";
import { ItemTexts } from "../ItemTexts";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Map } from "../Map";
import { Marker } from "../Marker";

interface Props {
  idLocal: string;
}

interface CoordinatesEvents {
  [coords: string]: Event[];
}

const EventsWithPerson = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      participant: id,
      orderBy: "date",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) =>
      old.participant === id ? old : { ...old, participant: id }
    );
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
        description: "Person events list heading",
        defaultMessage: "Events with this person as participant",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const EventsMap = ({
  events,
}: {
  events: ReturnType<typeof useEvents>["data"];
}) => {
  const mapRef = useRef<LeafletMap>();
  const allPlaces = useMemo(() => events?.map((e) => e.place) || [], [events]);
  const [places] = useCompletePlaces(allPlaces);
  const mapEvents: CoordinatesEvents = useMemo(
    () =>
      places.reduce((all, curr, idx) => {
        const lat = curr?.latitude;
        const lng = curr?.longitude;
        const coords = JSON.stringify([lat, lng]);
        return !lat || !lng || Number.isNaN(lat) || Number.isNaN(lng)
          ? all
          : {
              ...all,
              [coords]: [
                ...(all[coords] || []),
                { ...events?.[idx], place: curr } as Event,
              ],
            };
      }, {} as CoordinatesEvents),
    [events, places]
  );
  const bounds = useMemo(
    () => Object.keys(mapEvents).map((c) => JSON.parse(c) as LatLngTuple),
    [mapEvents]
  );
  useEffect(() => {
    if (mapRef.current && bounds.length) {
      mapRef.current.fitBounds(bounds);
    }
  }, [bounds]);
  return bounds.length ? (
    <Map bounds={bounds} className="w-full h-64 col-span-2 mt-8 md:mt-0">
      <MapConsumer>
        {(map) => {
          mapRef.current = map;
          return (
            <>
              {Object.entries(mapEvents).map(([coords, events]) => (
                <Marker
                  className="text-green-400"
                  icon={events.length === 1 ? faMapMarker : faBullseye}
                  key={coords}
                  position={JSON.parse(coords)}
                  popup={
                    <div className="m-2">
                      <div className="font-bold text-lg mb-2">
                        <FormattedMessage
                          description="Events heading"
                          defaultMessage="Events"
                        />
                      </div>
                      <div className="flex flex-col max-h-32 w-48 overflow-y-auto space-y-2">
                        {events.map((event, idx) => (
                          <ItemLink key={idx} item={event} />
                        ))}
                      </div>
                    </div>
                  }
                />
              ))}
            </>
          );
        }}
      </MapConsumer>
    </Map>
  ) : null;
};

export const PersonDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data } = usePerson({ idLocal });
  const events = useEvents({
    query: { participant: data?.id, limit: 100000 },
    paused: !data?.id,
  });
  const map = events ? <EventsMap events={events.data} /> : null;
  return data ? (
    <>
      <div
        className={clsx(
          "md:grid",
          "gap-8",
          map ? "grid-cols-6" : "grid-cols-4"
        )}
      >
        <div className="col-span-4 space-y-4">
          <div className="flex items-center">
            <Heading>
              <FormattedMessage
                description="Person heading"
                defaultMessage="Person: {label}"
                values={{ label: getText(data.labels) }}
              />
            </Heading>
            {authenticated && (
              <>
                <Link
                  className="ml-4 text-gray-400"
                  to={`/persons/${idLocal}?edit`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <DeleteButton
                  entityLabels={data.labels}
                  idLocal={idLocal}
                  type="persons"
                />
              </>
            )}
          </div>
          <ItemInheritance item={data} />
          <ItemLabels item={data} />
          <ItemTexts item={data} />
          <ItemSameAs item={data} />
          <ItemComments item={data} />
        </div>
        {map}
      </div>
      <EventsWithPerson id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
