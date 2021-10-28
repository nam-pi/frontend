import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { namespaces } from "App/namespaces";
import { EventsQuery, useAuth, useGroup } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DetailEditControls } from "../DetailEditControls";
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

interface Props {
  idLocal: string;
}

const EventsWithGroup = ({ id }: { id: string }) => {
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
        description: "Group events list heading",
        defaultMessage: "Events with this group as participant",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const GroupDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data } = useGroup({ idLocal });
  return data ? (
    <>
      <div className="flex items-center">
        <Heading>
          <FormattedMessage
            description="Group heading"
            defaultMessage="Group: {label}"
            values={{ label: getText(data.labels) }}
          />
        </Heading>
        {authenticated && (
          <DetailEditControls
            type="groups"
            idLocal={idLocal}
            labels={data.labels}
          />
        )}
      </div>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <ItemTexts item={data} />
      <ItemSameAs item={data} />
      {data.isPartOf && (
        <div>
          <Heading level={2}>
            <FormattedMessage
              description="Is part of list heading text"
              defaultMessage="Is part of"
            />
          </Heading>
          <div className="flex flex-col">
            {data.isPartOf?.map((g) => (
              <ItemLink key={g.idLocal} item={g} />
            ))}
          </div>
        </div>
      )}
      {data.hasPart && (
        <div>
          <Heading level={2}>
            <FormattedMessage
              description="has parts list heading text"
              defaultMessage="Has as part"
            />
          </Heading>
          <div className="flex flex-col">
            {data.hasPart?.map((g) => (
              <ItemLink key={g.idLocal} item={g} />
            ))}
          </div>
        </div>
      )}
      <ItemComments item={data} />
      <EventsWithGroup id={data.id} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
