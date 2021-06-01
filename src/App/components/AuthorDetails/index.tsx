import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { EventsQuery, useAuthor } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
}

const EventsWithAuthor = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      author: id,
      orderBy: "label",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) => (old.author === id ? old : { ...old, author: id }));
  }, [id]);

  return (
    <FilterableItemList
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <EventsFilterSettings query={query} setQuery={setQuery} />
      }
      headingLevel={2}
      linkBase="event"
      heading={formatMessage({
        description: "Author events list heading",
        defaultMessage: "Events created by this author",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const AuthorDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = useAuthor({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Author heading"
          defaultMessage="Author: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <EventsWithAuthor id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
