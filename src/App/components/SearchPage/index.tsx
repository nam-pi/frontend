import { SECONDARY_ITEM_LIMIT } from "App/constants";
import { useEventLabel } from "App/hooks/useEventLabel";
import { namespaces } from "App/namespaces";
import {
    AspectsQuery,
    EventsQuery,
    GroupsQuery,
    PersonsQuery,
    PlacesQuery,
    SourcesQuery
} from "nampi-use-api";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router";
import { AspectsFilterSettings } from "../AspectsFilterSettings";
import { EventsFilterSettings } from "../EventsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { GroupsFilterSettings } from "../GroupsFilterSettings";
import { Heading } from "../Heading";
import { Input } from "../Input";
import { Label } from "../Label";
import { PersonsFilterSettings } from "../PersonsFilterSettings";
import { PlacesFilterSettings } from "../PlacesFilterSettings";
import { SourcesFilterSettings } from "../SourcesFilterSettings";

const useSearchParam = (): string => {
  return new URLSearchParams(useLocation().search).get("s") || "";
};

const EventsList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<EventsQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <EventsFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="events"
      heading={formatMessage({
        description: "Events list heading",
        defaultMessage: "Events with this text",
      })}
      itemType={namespaces.core.event}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const PersonsList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<PersonsQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <PersonsFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="persons"
      heading={formatMessage({
        description: "Persons list heading",
        defaultMessage: "Persons with this text",
      })}
      itemType={namespaces.core.person}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const GroupsList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<GroupsQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <GroupsFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="groups"
      heading={formatMessage({
        description: "Groups list heading",
        defaultMessage: "Groups with this text",
      })}
      itemType={namespaces.core.group}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const PlacesList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<PlacesQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <PlacesFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="places"
      heading={formatMessage({
        description: "Places list heading",
        defaultMessage: "Places with this text",
      })}
      itemType={namespaces.core.place}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const AspectsList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<AspectsQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <AspectsFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="aspects"
      heading={formatMessage({
        description: "Aspects list heading",
        defaultMessage: "Aspects with this text",
      })}
      itemType={namespaces.core.aspect}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

const SourcesList = ({ text }: { text: string }) => {
  const { formatMessage } = useIntl();
  const getLabel = useEventLabel();
  const defaultQuery = useMemo<SourcesQuery>(
    () => ({
      orderBy: "label",
      text,
      limit: SECONDARY_ITEM_LIMIT,
    }),
    [text]
  );
  const [query, setQuery] = useState(defaultQuery);
  useEffect(() => {
    setQuery((old) => (old.text === text ? old : { ...old, text }));
  }, [text]);
  return (
    <FilterableItemList
      className="border-2 rounded-lg p-4"
      compact
      defaultQuery={defaultQuery}
      filterSettings={
        <SourcesFilterSettings query={query} setQuery={setQuery} />
      }
      forceEmpty={!text}
      headingLevel={2}
      linkBase="sources"
      heading={formatMessage({
        description: "Sources list heading",
        defaultMessage: "Sources with this text",
      })}
      itemType={namespaces.core.source}
      createLabel={getLabel}
      paused={!text}
      query={query}
      resetQuery={setQuery}
    />
  );
};

export const SearchPage = () => {
  const inputTimeout = useRef<undefined | NodeJS.Timeout>();
  const searchParam = useSearchParam();
  const [text, setText] = useState<string>(searchParam);
  const [synchronizedText, setSynchronizedText] = useState<string>(text);
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
    }
    inputTimeout.current = setTimeout(
      () => setSynchronizedText(text.replace(/\s/g, "")),
      300
    );
  }, [text]);
  useEffect(() => {
    if (text) {
      history.push(location.pathname + "?s=" + text);
    } else {
      history.push(location.pathname);
    }
  }, [history, location.pathname, text]);
  return (
    <div className="flex flex-col h-full">
      <Heading className="text-center mb-4">
        <FormattedMessage
          description="Search page heading"
          defaultMessage="Search"
        />
      </Heading>
      <div className="flex justify-center items-center w-full border-2 bg-gray-100 px-6 py-4 rounded-lg">
        <Label className="mr-2" htmlFor="search-input">
          <FormattedMessage description="Search text" defaultMessage="Search" />
        </Label>
        <Input
          id="search-input"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto">
        <EventsList text={synchronizedText} />
        <PersonsList text={synchronizedText} />
        <GroupsList text={synchronizedText} />
        <PlacesList text={synchronizedText} />
        <AspectsList text={synchronizedText} />
        <SourcesList text={synchronizedText} />
      </div>
    </div>
  );
};
