import { faBullseye, faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { useCompletePlaces } from "App/hooks/useCompletePlaces";
import { useEventDate } from "App/hooks/useEventDate";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { LatLngTuple, Map as LeafletMap } from "leaflet";
import {
    Event,
    EventsQuery,
    Person,
    useAuth,
    useEvents,
    usePerson
} from "nampi-use-api";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { MapConsumer } from "react-leaflet";
import { DetailEditControls } from "../DetailEditControls";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemLink } from "../ItemLink";
import { ItemPermalink } from "../ItemPermalink";
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
    }),
    [id]
  );
  const [query, setQuery] = useState<EventsQuery>({
    ...defaultQuery,
    participationType: namespaces.core.hasMainParticipant,
  });

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
  className,
  events,
}: {
  className?: string;
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
    <Map bounds={bounds} className={className}>
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
                    <>
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
                    </>
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

const Overview = ({ person }: { person: Person }) => {
  const intl = useIntl();
  const getDate = useEventDate();
  return (
    <div className="flex flex-col">
      {person.bornIn?.length && (
        <div>
          <FormattedMessage
            description="Birth list"
            defaultMessage="Born on {births}"
            values={{
              births: intl.formatList(
                (person.bornIn || []).map((birth) => (
                  <ItemLink
                    createText={() =>
                      getDate(birth, "short") ||
                      intl.formatMessage({
                        description: "Unknown date text",
                        defaultMessage: "Unknown",
                      })
                    }
                    item={birth}
                  />
                )),
                { type: "conjunction" }
              ),
            }}
          />
        </div>
      )}
      {person.diesIn?.length && (
        <div>
          <FormattedMessage
            description="Death list"
            defaultMessage="Died on {births}"
            values={{
              births: intl.formatList(
                (person.diesIn || []).map((birth) => (
                  <ItemLink
                    createText={() =>
                      getDate(birth, "short") ||
                      intl.formatMessage({
                        description: "Unknown date text",
                        defaultMessage: "Unknown",
                      })
                    }
                    item={birth}
                  />
                )),
                { type: "conjunction" }
              ),
            }}
          />
        </div>
      )}
    </div>
  );
};

export const PersonDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data, loading } = usePerson({ idLocal });
  const allEvents = useEvents({
    query: { participant: data?.id, limit: 100000 },
    paused: !data?.id,
  });
  return data && !loading ? (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="space-y-4 flex-grow w-full md:w-auto">
          <div className="flex items-center">
            <Heading>
              <FormattedMessage
                description="Person heading"
                defaultMessage="Person: {label}"
                values={{ label: getText(data.labels) }}
              />
            </Heading>
            {authenticated && (
              <DetailEditControls
                type="persons"
                idLocal={idLocal}
                labels={data.labels}
              />
            )}
          </div>
          <ItemPermalink item={data} />
          <ItemInheritance item={data} />
          <ItemLabels item={data} />
          <ItemTexts item={data} />
          <ItemSameAs item={data} />
          {data && <Overview person={data} />}
          <ItemComments item={data} />
        </div>
        {allEvents && (
          <EventsMap
            className="w-full md:min-w-64 md:w-64 h-64"
            events={allEvents.data}
          />
        )}
      </div>
      <EventsWithPerson id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
