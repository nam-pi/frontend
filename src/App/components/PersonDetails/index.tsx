import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { EventsQuery, useAuth, usePerson } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
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

export const PersonDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data } = usePerson({ idLocal });
  return data ? (
    <>
      <div className="flex items-center">
        <Heading>
          <FormattedMessage
            description="Person heading"
            defaultMessage="Person: {label}"
            values={{ label: getText(data.labels) }}
          />
        </Heading>
        {authenticated && (
          <Link className="ml-4 text-gray-400" to={`/persons/${idLocal}?edit`}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        )}
      </div>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <ItemComments item={data} />
      <EventsWithPerson id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
