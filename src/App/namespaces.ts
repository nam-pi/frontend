export const CORE_IRI = "http://purl.org/nampi/owl/core#";

const resource = (namespace: string, localName: string): string =>
  namespace + localName;

type Namespace = { iri: string; resource: (localName: string) => string };

const core: Namespace = {
  iri: CORE_IRI,
  resource: (localName) => resource(CORE_IRI, localName),
};

export type Namespaces = typeof namespaces;

export const namespaces = {
  core: {
    act: core.resource("act"),
    agent: core.resource("agent"),
    aspect: core.resource("aspect"),
    author: core.resource("author"),
    event: core.resource("event"),
    group: core.resource("group"),
    hasMainParticipant: core.resource("has_main_participant"),
    hasOtherParticipant: core.resource("has_other_participant"),
    hasParticipant: core.resource("has_participant"),
    hasUrl: core.resource("has_url"),
    person: core.resource("person"),
    place: core.resource("place"),
    source: core.resource("source"),
    sourceLocation: core.resource("source_location"),
    usesAspect: core.resource("uses_aspect"),
  },
};
