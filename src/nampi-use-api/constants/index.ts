import { namespaces } from "../namespaces";
import { ContextState, PropertyMap } from "../types";

const { api, core, hydra, rdfs, schema } = namespaces;

export const DEFAULT_LIMIT = 20;

export const DEFAULT_PROPERTY_MAP: PropertyMap = {
  [api.hierarchy.iri]: {
    [rdfs.label.iri]: "labels",
    [api.descendantOf.iri]: "descendantOf",
    [api.hierarchyRoot.iri]: "root",
  },
  [api.user.iri]: {
    [api.isAuthor.iri]: "author",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
    [schema.email.iri]: "email",
    [schema.familyName.iri]: "familyName",
    [schema.givenName.iri]: "givenName",
    [schema.identifier.iri]: "identifier",
    [schema.name.iri]: "username",
  },
  [core.act.iri]: {
    [core.hasInterpretation.iri]: "interpretation",
    [core.hasSourceLocation.iri]: "sourceLocation",
    [core.isAuthoredBy.iri]: "authors",
    [core.isAuthoredOn.iri]: "date",
    [rdfs.comment.iri]: "comment",
    [rdfs.label.iri]: "labels",
  },
  [core.aspect.iri]: {
    [core.hasText.iri]: "texts",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.author.iri]: {
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.event.iri]: {
    [core.hasText.iri]: "texts",
    [core.hasMainParticipant.iri]: "mainParticipant",
    [core.hasParticipant.iri]: "participants",
    [core.hasSortingDate.iri]: "sort",
    [core.isInterpretationOf.iri]: "act",
    [core.takesPlaceAt.iri]: "place",
    [core.takesPlaceNotEarlierThan.iri]: "earliest",
    [core.takesPlaceNotLaterThan.iri]: "latest",
    [core.takesPlaceOn.iri]: "exact",
    [core.usesAspect.iri]: "aspects",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.group.iri]: {
    [core.hasText.iri]: "texts",
    [core.hasPart.iri]: "hasPart",
    [core.isPartOf.iri]: "isPartOf",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.place.iri]: {
    [core.hasLatitude.iri]: "latitude",
    [core.hasLongitude.iri]: "longitude",
    [core.hasText.iri]: "texts",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.person.iri]: {
    [core.hasText.iri]: "texts",
    [core.diesIn.iri]: "diesIn",
    [core.isBornIn.iri]: "bornIn",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.source.iri]: {
    [core.hasText.iri]: "texts",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [core.sourceLocation.iri]: {
    [core.hasSource.iri]: "source",
    [core.hasText.iri]: "text",
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
  },
  [hydra.Collection.iri]: {
    [hydra.member.iri]: "members",
    [hydra.totalItems.iri]: "total",
  },
  [hydra.Status.iri]: {
    [hydra.statusCode.iri]: "code",
    [hydra.title.iri]: "title",
    [hydra.description.iri]: "description",
  },
  [rdfs.Resource.iri]: {
    [rdfs.comment.iri]: "comments",
    [rdfs.label.iri]: "labels",
    [api.descendantOf.iri]: "descendantOf",
  },
};

export const DEFAULT_SEARCH_TIMEOUT = 200;

export const DEFAULT_CONTEXT_STATE: ContextState = {
  apiUrl: "",
  defaultLimit: DEFAULT_LIMIT,
  initialized: false,
  inversePropertyMap: {},
  authenticated: false,
  login: () => {
    throw new Error("No Keycloak realm and client provided.");
  },
  logout: () => {
    throw new Error("No Keycloak realm and client provided.");
  },
  propertyMap: {},
  searchTimeout: DEFAULT_SEARCH_TIMEOUT,
  token: undefined,
  updateToken: () => {
    throw new Error("No Keycloak realm and client provided.");
  },
};
