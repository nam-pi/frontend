import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { EventsQuery, useAuth, useSource } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DetailEditControls } from "../DetailEditControls";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemPermalink } from "../ItemPermalink";
import { ItemSameAs } from "../ItemSameAs";
import { ItemTexts } from "../ItemTexts";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
}

const EventsWithSource = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      source: id,
      orderBy: "date",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) => (old.source === id ? old : { ...old, source: id }));
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
        description: "Source events list heading",
        defaultMessage: "Events created using this source",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const SourceDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data, loading } = useSource({ idLocal });
  return data && !loading ? (
    <>
      <div className="flex items-center">
        <Heading>
          <FormattedMessage
            description="Source heading"
            defaultMessage="Source: {label}"
            values={{ label: getText(data.labels) }}
          />
        </Heading>
        {authenticated && (
          <DetailEditControls
            type="sources"
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
      <ItemComments item={data} />
      <EventsWithSource id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
