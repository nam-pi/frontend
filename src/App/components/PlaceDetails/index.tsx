import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useCompletePlace } from "App/hooks/useCompletePlaces";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import clsx from "clsx";
import { LatLngTuple } from "leaflet";
import { EventsQuery, useAuth, usePlace } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { DeleteButton } from "../DeleteButton";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemSameAs } from "../ItemSameAs";
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
  const { authenticated } = useAuth();
  const { data } = usePlace({ idLocal });
  const [place] = useCompletePlace(data);
  const coordinates: undefined | LatLngTuple =
    place?.latitude && place?.longitude
      ? [place.latitude, place.longitude]
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
        <div className="col-span-4 space-y-4">
          <div className="flex items-center">
            <Heading>
              <FormattedMessage
                description="Place heading"
                defaultMessage="Place: {label}"
                values={{ label: getText(data.labels) }}
              />
            </Heading>
            {authenticated && (
              <>
                <Link
                  className="ml-4 text-gray-400"
                  to={`/places/${idLocal}?edit`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <DeleteButton
                  entityLabels={data.labels}
                  idLocal={idLocal}
                  type="places"
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
        {coordinates && (
          <Map
            className="w-full h-64 col-span-2 mt-8 md:mt-0"
            center={coordinates}
          >
            <Marker className="text-red-500" position={coordinates} />
          </Map>
        )}
      </div>
      <EventsWithPlace id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
