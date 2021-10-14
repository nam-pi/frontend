import { sortByEventDate } from "../sorters/sortByEventDate";
import { sortById } from "../sorters/sortById";
import { sortByLabel } from "../sorters/sortByLabel";
import {
    Act,
    ActsQuery,
    Aspect,
    AspectMutationPayload,
    AspectsQuery,
    Author,
    AuthorsQuery,
    CollectionQuery,
    DeleteHook,
    Event,
    EventMutationPayload,
    EventsQuery,
    FetchCollectionHook,
    FetchHook,
    FetchResult,
    Group,
    GroupMutationPayload,
    GroupsQuery,
    Hierarchy,
    HierarchyQuery,
    MutationHook,
    Person,
    PersonMutationPayload,
    PersonsQuery,
    Place,
    PlaceMutationPayload,
    SortFunction,
    Source,
    SourceMutationPayload,
    SourcesQuery,
    Type,
    TypesQuery,
    User
} from "../types";
import { buildPath } from "../utils/buildPath";
import { getDateString } from "../utils/getDateString";
import { useFetch } from "./useFetch";
import { useCreate, useDelete, useUpdate } from "./useMutation";
import { useNampiContext } from "./useNampiContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDefaultSorter = (query: CollectionQuery): SortFunction<any> => {
  switch (query.orderBy) {
    case "label":
      return sortByLabel;
    default:
      return sortById;
  }
};

export const useActs: FetchCollectionHook<Act, ActsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "acts"), query, sorter, paused);
};

export const useAct: FetchHook<Act> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "acts", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useAspects: FetchCollectionHook<Aspect, AspectsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "aspects"), query, sorter, paused);
};

export const useAspectCreate = (): MutationHook<
  AspectMutationPayload,
  Aspect
> => useCreate("aspects");

export const useAspectDelete = (idLocal: string): DeleteHook =>
  useDelete("aspects", idLocal);

export const useAspectUpdate = (
  idLocal: string
): MutationHook<AspectMutationPayload, Aspect> => useUpdate("aspects", idLocal);

export const useAspect: FetchHook<Aspect> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "aspects", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useAuthors: FetchCollectionHook<Author, AuthorsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "authors"), query, sorter, paused);
};

export const useAuthor: FetchHook<Author> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "authors", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useEvent: FetchHook<Event> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "events", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useEventCreate = (): MutationHook<EventMutationPayload, Event> =>
  useCreate("events");

export const useEventDelete = (idLocal: string): DeleteHook =>
  useDelete("events", idLocal);

export const useEventUpdate = (
  idLocal: string
): MutationHook<EventMutationPayload, Event> => useUpdate("events", idLocal);

export const useEvents: FetchCollectionHook<Event, EventsQuery> = ({
  paused,
  query,
}) => {
  const copy = { ...query };
  const { apiUrl } = useNampiContext();
  let sorter: undefined | SortFunction<any> = undefined; // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (copy.orderBy) {
    case "date":
      sorter = sortByEventDate;
      break;
    default:
      sorter = getDefaultSorter(copy);
  }
  if (copy.startDate || copy.endDate) {
    const dates = `${getDateString(copy.startDate)}|${getDateString(
      copy.endDate
    )}`;
    delete copy.startDate;
    delete copy.endDate;
    copy.dates = dates;
  }
  return useFetch(buildPath(apiUrl, "events"), copy, sorter, paused);
};

export const useGroup: FetchHook<Group> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "groups", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useGroupCreate = (): MutationHook<GroupMutationPayload, Group> =>
  useCreate("groups");

export const useGroupDelete = (idLocal: string): DeleteHook =>
  useDelete("groups", idLocal);

export const useGroupUpdate = (
  idLocal: string
): MutationHook<GroupMutationPayload, Group> => useUpdate("groups", idLocal);

export const useGroups: FetchCollectionHook<Group, GroupsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "groups"), query, sorter, paused);
};

export const useHierarchy = ({
  paused,
  query,
}: Parameters<
  FetchCollectionHook<Hierarchy, HierarchyQuery>
>[0]): FetchResult<Hierarchy> => {
  const { apiUrl } = useNampiContext();
  const { data, initialized, loading } = useFetch<Hierarchy, HierarchyQuery>(
    buildPath(apiUrl, "hierarchy"),
    query,
    undefined,
    paused
  );
  return { data: data as unknown as Hierarchy, initialized, loading };
};

export const usePerson: FetchHook<Person> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "persons", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const usePersonCreate = (): MutationHook<
  PersonMutationPayload,
  Person
> => useCreate("persons");

export const usePersonDelete = (idLocal: string): DeleteHook =>
  useDelete("persons", idLocal);

export const usePersonUpdate = (
  idLocal: string
): MutationHook<PersonMutationPayload, Person> => useUpdate("persons", idLocal);

export const usePersons: FetchCollectionHook<Person, PersonsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "persons"), query, sorter, paused);
};

export const usePlace: FetchHook<Place> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "places", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const usePlaceCreate = (): MutationHook<PlaceMutationPayload, Place> =>
  useCreate("places");

export const usePlaceDelete = (idLocal: string): DeleteHook =>
  useDelete("places", idLocal);

export const usePlaceUpdate = (
  idLocal: string
): MutationHook<PlaceMutationPayload, Place> => useUpdate("places", idLocal);

export const usePlaces: FetchCollectionHook<Place, PersonsQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "places"), query, sorter, paused);
};

export const useSource: FetchHook<Source> = ({ idLocal, paused }) => {
  const { apiUrl } = useNampiContext();
  return useFetch(
    buildPath(apiUrl, "sources", idLocal),
    undefined,
    undefined,
    paused
  );
};

export const useSourceCreate = (): MutationHook<
  SourceMutationPayload,
  Source
> => useCreate("sources");

export const useSourceDelete = (idLocal: string): DeleteHook =>
  useDelete("sources", idLocal);

export const useSourceUpdate = (
  idLocal: string
): MutationHook<SourceMutationPayload, Source> => useUpdate("sources", idLocal);

export const useSources: FetchCollectionHook<Source, SourcesQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "sources"), query, sorter, paused);
};

export const useTypes: FetchCollectionHook<Type, TypesQuery> = ({
  paused,
  query,
}) => {
  const { apiUrl } = useNampiContext();
  const sorter = getDefaultSorter(query);
  return useFetch(buildPath(apiUrl, "types"), query, sorter, paused);
};

export const useUser = (): FetchResult<User> => {
  const { apiUrl } = useNampiContext();
  return useFetch(buildPath(apiUrl, "users", "current"), undefined, undefined);
};
