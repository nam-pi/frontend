import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { usePersonLabel } from "App/hooks/usePersonLabel";
import { namespaces } from "App/namespaces";
import { EventsQuery, PersonsQuery, useAspect } from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { Heading } from "../Heading";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { MultiLangTexts } from "../MultiLangTexts";
import { PersonsFilterSettings } from "../PersonsFilterSettings";

interface Props {
  idLocal: string;
}

const EventsWithAspect = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      aspect: id,
      orderBy: "date",
      participantType: "",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) => (old.aspect === id ? old : { ...old, aspect: id }));
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
        description: "Aspect events list heading",
        defaultMessage: "Events that use this aspect",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const PersonsWithAspect = ({ id }: { id: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = usePersonLabel();
  const defaultQuery = useMemo<PersonsQuery>(
    () => ({
      aspect: id,
      orderBy: "label",
      text: "",
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [id]
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery((old) => (old.aspect === id ? old : { ...old, aspect: id }));
  }, [id]);

  return (
    <FilterableItemList
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <PersonsFilterSettings query={query} setQuery={setQuery} />
      }
      headingLevel={2}
      linkBase="person"
      heading={formatMessage({
        description: "Person events list heading",
        defaultMessage: "Persons that use this aspect",
      })}
      itemType={namespaces.core.person}
      createLabel={getLabel}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const AspectDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = useAspect({ idLocal });
  const textCount = data?.text?.length;
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Aspect heading"
          defaultMessage="Aspect: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      {textCount && (
        <div>
          <Heading level={2}>
            <FormattedMessage
              description="Texts list list heading text"
              defaultMessage="{textCount, plural, one {Text content} other {Text content variants}}"
              values={{ textCount }}
            />
          </Heading>
          <div className="flex flex-col">
            <MultiLangTexts texts={data.text} />
          </div>
        </div>
      )}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
        <EventsWithAspect id={data.id} />
        <PersonsWithAspect id={data.id} />
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
