import { NodeObject } from "jsonld";
import { JsonLdArray } from "jsonld/jsonld-spec";
import { KeycloakInstance } from "keycloak-js";
import { namespaces } from "./namespaces";

/** A document interpretation act */
export interface Act extends Item {
  /** The interpretation of the document interpretation act */
  interpretation: Event;
  /** The authors of the document interpretation act */
  authors: Author[];
  /** The date the document interpretation act was created */
  date: Date;
  /** The source location for the document interpretation act */
  sourceLocation: SourceLocation;
}

export interface ActsQuery extends CollectionQuery {
  /** Filter by author of the document interpretation act */
  author?: string;
  /** Filter by source of the document interpretation act */
  source?: string;
}

/** An aspect */
export interface Aspect extends Item {
  /** Items, possibly in other databases, that are the same as this aspect */
  sameAs?: string[];
  /** Textual content that is added to the aspect */
  texts?: LiteralString[];
}

export interface AspectMutationPayload extends BaseMutationPayload {
  /** Items, possibly in other databases, that are the same as this aspect */
  sameAs?: string[];
}

export interface AspectsQuery extends CollectionQuery {
  /** Filter by participants of events the aspect is used in */
  participant?: string;
}

/** An author */
export type Author = Item;

export type AuthorsQuery = CollectionQuery;

interface BaseMutationPayload {
  /**
   * Comments for the entity. Can be simple strings or language literal strings according to https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
   * @example A string
   * @example A language string@en
   */
  comments: string[];
  /**
   * Labels for the entity. Can be simple strings or language literal strings according to https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
   * @example A string
   * @example A language string@en
   */
  labels: string[];
  /**
   * Texts for the entity. Can be simple strings or language literal strings according to https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
   * @example A string
   * @example A language string@en
   */
  texts: string[];
  /**
   * The full URLs for all entity types.
   * @example https://purl.org/nampi/owl/core#event
   */
  types: string[];
}

export type Blanks = Record<string, string>;

export type Cache = Record<string, Normalized>;

/** An entity collection */
export interface Collection<T extends Entity> extends Item {
  /** The url to the first page of partial collection results */
  first: undefined | string;
  /** The url to the last page of partial collection results */
  last: undefined | string;
  /** The returned collection members */
  members: T[];
  /** The url to the next page of partial collection results */
  next: undefined | string;
  /** The current page */
  page: number;
  /** The url to the previous page of partial collection results */
  previous: undefined | string;
  /** The total number of results */
  total: number;
}

/** A set of functions to navigate to different parts of the collection */
export interface CollectionNav {
  /** Navigate to the first page in the collection */
  first?: undefined | VoidFunction;
  /** Navigate to the previous page in the collection */
  previous?: undefined | VoidFunction;
  /** Navigate to the next page in the collection */
  next?: undefined | VoidFunction;
  /** Navigate to the last page in the collection */
  last?: undefined | VoidFunction;
}

/** Query parameters to fetch a partial collection */
export interface CollectionQuery extends Record<string, unknown> {
  /** Limits the number of returned results to the given number */
  limit?: number;
  /** Starts to return results from the given offset */
  offset?: number;
  /** What to order the items by */
  orderBy?: string;
  /** Returns the given page of results */
  page?: number;
  /** The text content to filter the items by */
  text?: string;
  /** Filter by type. This can be any ancestor of the collection item as defined in any connected ontology */
  type?: string;
}

/** The internal state of the use-NAMPI context */
export interface ContextState {
  apiUrl: string;
  authenticated: boolean;
  defaultLimit: number;
  initialized: boolean;
  inversePropertyMap: InversePropertyMap;
  login: KeycloakInstance["login"];
  logout: KeycloakInstance["logout"];
  propertyMap: PropertyMap;
  searchTimeout: number;
  token: KeycloakInstance["token"];
  updateToken: KeycloakInstance["updateToken"];
}

type DefaultOrderBy = "id" | "label";

/** A data entity */
export interface Entity {
  /** The local part of the id. Example: "12345" of "http://example.com/data/12345" */
  idLocal: string;
  /** The labels of the entity */
  labels?: LiteralString[];
  /** The RDF type iris */
  types: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** An event */
export interface Event extends Item {
  /** Textual content that is added to the event */
  texts?: LiteralString[];
  /** The document interpretation act this event is used */
  act: Act;
  /** The sorting date for the event, to be used when sorting the event as part of a list */
  sort?: Date;
  /** The exact date the event happened */
  exact?: Date;
  /** The earliest possible date the event could have happened */
  earliest?: Date;
  /** The latest possible date the event could have happened */
  latest?: Date;
  /** The main participant of the event */
  mainParticipant: Person;
  /** All participants of the event */
  participants: Person[];
  /** All aspects of the event */
  aspects: Aspect[];
  /** The place where the event took place */
  place?: Place;
}

export type Endpoint =
  | "events"
  | "persons"
  | "aspects"
  | "places"
  | "groups"
  | "sources";

export interface EventMutationPayload extends BaseMutationPayload {
  /**
   * The aspects that are used in the events.
   * Can be either a full URL for each aspect or the full URLS for each aspect usage (default is core:uses_aspect)
   * and aspect type, separated by a pipe-char.
   * @example http://example.org/aspects/7755ab2f-aaab-4c96-bfb4-faff947c1bc8
   * @example https://purl.org/nampi/owl/core#adds_aspect|http://example.org/aspects/7755ab2f-aaab-4c96-bfb4-faff947c1bc8
   */
  aspects: string[];
  /**
   * All authors of the connected document interpretation act with their full URL.
   * @example http://example.org/authors/54d5056c-0d87-4a23-8211-390920b22248
   * */
  authors: string[];
  /**
   * The date for the event. Can be a variant of one or two dates in the format (-?)YYYY-MM-DD, separated by a pipe.
   * Values with a preceding hyphen signify dates BCE.
   * @example 1798-12-01 Exactly on the date
   * @example -0050-12-01 Exactly on the date (BCE)
   * @example 1798-12-01| Not earlier than the date
   * @example |1798-12-01 Not later than the date
   * @example 1797-01-01|1798-12-01 Not earlier than the first date and not later than the second date
   */
  date: string;
  /**
   * The main participant of the event.
   * Can be either the person's full URL or the full URLS for the participation (default is core:has_main_participant)
   * and the person type, separated by a pipe-char.
   * @example http://example.org/persons/7755ab2f-aaab-4c96-bfb4-faff947c1bc8
   * @example https://purl.org/nampi/owl/core#starts_life_of|http://example.org/persons/7755ab2f-aaab-4c96-bfb4-faff947c1bc8
   */
  mainParticipant: string;
  /**
   * The other participants of the event.
   * Can be either a full URL for each person or the full URLS for each participation  (default is core:has_participant)
   * and person type, separated by a pipe-char.
   * @example https://purl.org/nampi/owl/core#has_participant|http://example.org/persons/7755ab2f-aaab-4c96-bfb4-faff947c1bc8
   */
  otherParticipants: string[];
  /**
   * The full URL of the event place.
   * @example http://example.org/places/8757ab2f-aaab-4c96-bfb4-faff947c1be7
   */
  place: string;
  /**
   * The full URL of the interpretation source.
   * @example http://example.org/sources/9876ab2f-aaab-4c96-bfb4-faff947c1be7
   */
  source: string;
  /**
   * The text of the source location.
   * @example p7
   * @example 6v
   * @example pages 7-9
   */
  sourceLocation: string;
}

/** Query parameters to fetch a partial events collection */
export interface EventsQuery extends CollectionQuery {
  /** Filter by aspect used in the event. Can be the iri of any aspect individual */
  aspect?: string;
  /** Filter by the type of aspect used in the event. Can be any subclass of *https://purl.org/nampi/owl/core#aspect* that is part of the connected ontologies */
  aspectType?: string;
  /** Filter by the type of aspect use. Can be any subclass of *https://purl.org/nampi/owl/core#uses_aspect* that is part of the connected ontologies */
  aspectUseType?: string;
  /** Filter by the author of the connected document interpretation act. Can be the iri of any author individual */
  author?: string;
  /** Filter events by end date. All events that have dates (exact, earliest, latest, sort), *at* or *before* this date will be included */
  endDate?: Date;
  /** What to order the events by */
  orderBy?: DefaultOrderBy | "date";
  /** Filter by event participant. Can be the iri of any agent individual */
  participant?: string;
  /** Filter by type of participant. Can by the iri of any subclass of *https://purl.org/nampi/owl/core#agent* that is part of the connected ontologies */
  participantType?: string;
  /** Filter by participation type. Can by any subclass of *https://purl.org/nampi/owl/core#has_participant* that is part of the connected ontologies */
  participationType?: string;
  /** Filter by event place. Can be the iri of any place individual */
  place?: string;
  /** Filter events by start date. All events that have dates (exact, earliest, latest, sort), *at* or *after* this date will be included */
  startDate?: Date;
}

export type FetchCollectionHook<T, Q extends CollectionQuery> = <
  ExtendedType extends Record<string, unknown> = Record<string, never>
>(config: {
  paused?: boolean;
  query: Q;
}) => FetchCollectionResult<T & ExtendedType>;

/** The result of an Entity collection fetch query */
export interface FetchCollectionResult<T = Item> extends FetchResult<T[]> {
  /** Navigation to different parts of the collection */
  nav: CollectionNav;
  /** The current page of the collection */
  page: undefined | number;
  /** The total number of results (members) of the collection */
  total: undefined | number;
}

export type FetchHook<T> = <
  ExtendedType extends Record<string, unknown> = Record<string, never>
>(config: {
  idLocal: string;
  paused?: boolean | undefined;
}) => FetchResult<T & ExtendedType>;

/** The result of a single item fetch query */
export interface FetchResult<T = Item> {
  /** Whether or not the API connection is already initialized */
  initialized: boolean;
  /** Whether or not the result is currently being fetched */
  loading: boolean;
  /** The resulting data */
  data: undefined | T;
}

/** A group */
export interface Group extends Item {
  /** Items, possibly in other databases, that are the same as this group. */
  sameAs?: string[];
  /** Groups this group is part of. */
  isPartOf?: Group[];
  /** Groups that are a part of this group. */
  hasPart?: Group[];
  /** Textual content that is added to the group */
  texts?: LiteralString[];
}

export interface GroupMutationPayload extends BaseMutationPayload {
  /** Items, possibly in other databases, that are the same as this aspect */
  sameAs?: string[];
  /** The full URLs of existing groups in the NAMPI database this group is a part of*/
  partOf?: string[];
}

/** Query parameters to fetch a partial groups collection */
export type GroupsQuery = CollectionQuery;

export interface Hierarchy extends Omit<Item, "response">, Entity {
  /** The id of the root item */
  root: string;
  /** A map with all hierarchy items indexed by their id for fast access */
  items: { [id: string]: HierarchyItem };
  /** All inheritance paths for the current hierarchy ([[ child -> parent 1 -> parent 2 -> parent 3 ], [ child -> parent A -> parent B ]]) */
  paths: string[][];
}

export interface HierarchyItem extends Item {
  /** The ids of all items this item is a descendant of */
  descendantOf: undefined | string[];
  /** The ids of the direct parent items */
  parents: string[];
  /** The ids of the direct children items */
  children: string[];
}

export interface HierarchyQuery extends Record<string, unknown> {
  /** The iri of the item to get the hierarchy for */
  iri: string;
  /** Whether or not to query descendants of the item with the provided iri */
  descendants?: boolean;
}

/** An inverted version of a property map where the property iris and short keys are switched to simplify reverse iri lookups */
export interface InversePropertyMap {
  [itemIri: string]: { [shortKey: string]: string };
}

/** An item */
export interface Item extends Entity {
  /** The comments of the item */
  comments?: LiteralString[];
  /** The id (iri) */
  id: string;
  /** The original item response in the form of an expanded JSON-LD array */
  response: JsonLdArray;
}

/** A set of links in the normalized query cache */
export interface Links {
  [property: string]: string | string[];
}

/** A simplified RDF literal */
export interface Literal {
  /** The value */
  value: number | string | Date;
}

/** A simplified XSD DateTime literal */
export interface LiteralDateTime extends Literal {
  value: Date;
}

/** A simplified XSD number literal */
export interface LiteralNumber extends Literal {
  value: number;
}

/** A simplified RDF language string literal */
export interface LiteralString extends Literal {
  value: string;
  /** The language string */
  language?: undefined | string;
}

export type MaybeNodes = undefined | NodeObject[];

export type MutationFunction<PayloadType, ResultType> = (
  payload: PayloadType
) => Promise<MutationResultContent<ResultType>>;

export type MutationHook<PayloadType = undefined, ResultType = true> = [
  mutate: MutationFunction<PayloadType, ResultType>,
  state: MutationState<ResultType>
];

export type DeleteHook = [
  () => Promise<MutationResultContent<true>>,
  MutationState<true>
];

export type MutationPayload = Record<string, undefined | string | string[]>;

export interface MutationResultContent<ResultType> {
  error?: undefined | NampiError;
  data?: undefined | ResultType;
}

export interface MutationState<ResultType>
  extends MutationResultContent<ResultType> {
  loading: boolean;
}

export interface Namespace {
  iri: string;
  resource: (localName: string) => RDFResource;
}

export type Namespaces = typeof namespaces;

export interface NampiError {
  description: LiteralString;
  statusCode: number;
  title: LiteralString;
  /** The RDF type iris */
  types: string[];
}

export interface Normalized extends NormalizeResult {
  links: Links;
}

export type Normalizer = (
  node: NodeObject,
  normalized: Normalized,
  cache: Cache,
  blanks: Blanks,
  propertyMap: PropertyMap
) => Promise<void>;

export interface NormalizeResult extends Record<string, unknown> {
  id: string;
  idLocal: string;
  labels?: LiteralString[];
  types: string[];
}

/** A person */
export interface Person extends Item {
  /** All events the person is declared as born in */
  bornIn?: Event[];
  /** All events the person is declared as having died in */
  diesIn?: Event[];
  /** Items, possibly in other databases, that are the same as this person. */
  sameAs?: string[];
  /** Textual content that is added to the person */
  texts?: LiteralString[];
}

export interface PersonMutationPayload extends BaseMutationPayload {
  /** Items, possibly in other databases, that are the same as this person */
  sameAs?: string[];
}

/** Query parameters to fetch a partial persons collection */
export interface PersonsQuery extends CollectionQuery {
  /** Filter by aspects used in events the person appears in combination with a property descending of 'changes aspect of'. */
  aspect?: string;
}

/** A place */
export interface Place extends Item {
  /** Items, possibly in other databases, that are the same as this place. */
  sameAs?: string[];
  /** Textual content that is added to the person */
  texts?: LiteralString[];
  /** The latitude of the place */
  latitude?: number;
  /** The longitude of the place */
  longitude?: number;
}

export interface PlaceMutationPayload extends BaseMutationPayload {
  /** Items, possibly in other databases, that are the same as this place */
  sameAs?: string[];
  /** The latitude of the place. Should be the string representation of a number between -90 and 90 */
  latitude?: string;
  /** The longitude of the place. Has to be the string representation of a number between -180 and 180 */
  longitude?: string;
}

/** Query parameters to fetch a partial places collection */
export type PlacesQuery = CollectionQuery;

/** A map that gives property keys that should replace the actual item rdf property iris when normalize JSON-LD responses. */
export interface PropertyMap {
  [itemType: string]: { [propertyKey: string]: string };
}

/** The NAMPI Provider configuration */
export interface ProviderConfig {
  /** The URL of the NAMPI API endpoint * */
  api: string;
  /** The URL of the NAMPI Keycloak auth endpoint.  */
  auth?: string;
  /** Whether or not to enable the keycloak logging mechanism */
  authLogging?: boolean;
  /** The name of the Keycloak client to use. If not present in combination with "realm", the login and logout auth functions will throw an error on use.  */
  client?: string;
  /** The default limit to use when querying collections */
  defaultLimit?: number;
  /** An optional custom property map to use when normalizing responses */
  propertyMap?: PropertyMap;
  /** The name of the Keycloak realm. If not present in combination with "client", the login and logout auth functions will throw an error on use.  */
  realm?: string;
  /** The timeout in ms to bundle search box entries when live searching so the server doesn't get flooded. Defaults to 200ms */
  searchTimeout?: number;
  /** Whether or not to to keep users logged in over browser restarts */
  sso?: boolean;
  /** Enables the silent sso check. If enabled, the url to a site on the NAMPI app with special content needs to be provided.  * The content is described in the Keycloak documentation: https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc */
  silentSsoUri?: string;
}

export interface RDFResource {
  equals: (value: string) => boolean;
  iri: string;
  localName: string;
}

/** A function to sort a partial collection fetch result */
export type SortFunction<T> = (a: T, b: T) => -1 | 0 | 1;

/** A source location */
export interface SourceLocation extends Item {
  /** The location text, usually the page, url or other textual content that specifies the actual location */
  text: string;
  /** The source for the source location */
  source: Source;
}

/** A source */
export interface Source extends Item {
  /** Items, possibly in other databases, that are the same as this source. */
  sameAs?: string[];
  /** Textual content that is added to the source */
  texts?: LiteralString[];
}

export interface SourceMutationPayload extends BaseMutationPayload {
  /** Items, possibly in other databases, that are the same as this source */
  sameAs?: string[];
}

/** Query parameters to fetch a partial sources collection */
export type SourcesQuery = CollectionQuery;

export type Timeout = undefined | ReturnType<typeof setTimeout>;

export type Type = Item;

export interface TypesQuery extends Omit<CollectionQuery, "text"> {
  type: string;
}

export interface UseAuth
  extends Pick<KeycloakInstance, "authenticated" | "login" | "logout"> {
  /** Whether or not the authentication connection is initialized */
  initialized: boolean;
}

/** A user */
export interface User extends Entity {
  /** A connected author entity */
  author?: {
    id: string;
    idLocal: string;
  };
  /** The email */
  email: string;
  /** The family name */
  familyName: undefined | string;
  /** The given name */
  givenName: undefined | string;
  /** The NAMPI username */
  username: string;
  /** The user identifier */
  identifier: string;
}
