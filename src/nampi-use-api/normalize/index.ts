import { NodeObject } from "jsonld";
import { JsonLdArray } from "jsonld/jsonld-spec";
import { v4 as uuidv4 } from "uuid";
import { namespaces } from "../namespaces";
import {
    Blanks,
    Cache,
    Literal,
    LiteralString,
    Normalized,
    Normalizer,
    NormalizeResult,
    PropertyMap
} from "../types";
import { parseDate } from "../utils/parseDate";
import { getIdLocal } from "./helpers/getIdLocal";
import { isBlank } from "./helpers/isBlank";
import { mapKey } from "./helpers/mapKey";
import { addLinks } from "./helpers/transforms";
import { normalizeActs } from "./normalizers/normalizeActs";
import { normalizeCollection } from "./normalizers/normalizeCollection";
import { normalizeEvent } from "./normalizers/normalizeEvent";
import { normalizeHierarchy } from "./normalizers/normalizeHierarchy";
import { normalizePlaces } from "./normalizers/normalizePlaces";
import { normalizeSourceLocation } from "./normalizers/normalizeSourceLocation";
import { normalizeStatus } from "./normalizers/normalizeStatus";
import { normalizeUser } from "./normalizers/normalizeUser";

const { api, core, hydra, xsd } = namespaces;

const findNormalizer = (type: undefined | string): Normalizer => {
  switch (type) {
    case api.hierarchy.iri:
      return normalizeHierarchy;
    case core.act.iri:
      return normalizeActs;
    case hydra.Collection.iri:
      return normalizeCollection;
    case core.event.iri:
      return normalizeEvent;
    case core.place.iri:
      return normalizePlaces;
    case core.sourceLocation.iri:
      return normalizeSourceLocation;
    case api.user.iri:
      return normalizeUser;
    case hydra.Status.iri:
      return normalizeStatus;
    default:
      // Do nothing
      return async () => undefined;
  }
};

const initNormalized = async (
  node: NodeObject,
  cache: Cache,
  blanks: Blanks,
  propertyMap: PropertyMap
): Promise<Normalized> => {
  const normalized = { links: {} } as Normalized;
  const resourceIris = Object.keys(node);
  for (let i = 0, length = resourceIris.length; i < length; i++) {
    const iri = resourceIris[i];
    if (node[iri] === null || node[iri] === undefined) {
      continue;
    }
    // Add types
    if (iri === "@type") {
      const resource = node[iri] as string | string[];
      normalized.types = (
        Array.isArray(resource) ? resource : [resource]
      ) as string[];
    }
    // Add id
    else if (iri === "@id") {
      const id = node["@id"] || "";
      if (isBlank(id)) {
        const idLocal = blanks[id] ? blanks[id] : uuidv4();
        normalized.idLocal = idLocal;
        blanks[id] = idLocal;
      } else {
        normalized.id = id;
        normalized.idLocal = getIdLocal(id);
      }
    } else if (iri === namespaces.core.sameAs.iri) {
      normalized.sameAs = (
        node[namespaces.core.sameAs.iri] as unknown as Record<string, string>[]
      )?.map((v) => v["@id"]);
    }
    // Add all other nodes
    else {
      const resource = (
        Array.isArray(node[iri]) ? node[iri] : [node[iri]]
      ) as NodeObject[];
      const properties: Normalized[] = [];
      const literals: Literal[] = [];
      for (let i = 0, length = resource.length; i < length; i++) {
        const property = await normalizeNode(
          resource[i],
          cache,
          blanks,
          propertyMap
        );
        if (!property) {
          continue;
        } else if (property.value !== undefined) {
          literals.push(property as Literal);
        } else {
          properties.push(property as Normalized);
        }
      }
      const propertyKey = mapKey(propertyMap, normalized.types, iri);
      if (literals.length > 0) {
        normalized[propertyKey] = literals;
      } else if (properties.length > 0) {
        const localIds = properties.map((property) => property.idLocal);
        addLinks(normalized, propertyKey, localIds, blanks);
      }
    }
  }
  return normalized;
};

const joinCache = (normalized: Normalized, cache: Cache): NormalizeResult => {
  const result: NormalizeResult = { ...normalized };
  delete result.links;
  const linkProperties = Object.keys(normalized.links);
  for (let i = 0, iLength = linkProperties.length; i < iLength; i++) {
    const property = linkProperties[i];
    const links = normalized.links[property];
    if (typeof links === "string") {
      result[property] = joinCache(cache[links], cache);
    } else {
      const results = [];
      for (let j = 0, jLength = links.length; j < jLength; j++) {
        results.push(joinCache(cache[links[j]], cache));
      }
      result[property] = results;
    }
  }
  return result;
};

const normalizeNode = async (
  node: NodeObject | null,
  cache: Cache,
  blanks: Blanks,
  propertyMap: PropertyMap
): Promise<undefined | Normalized | Literal> => {
  if (!node || typeof node !== "object") {
    return;
  }
  if (node["@value"]) {
    const value = node["@value"] as string;
    const types = node["@type"];
    if (types?.includes(xsd.dateTime.iri)) {
      return { value: parseDate(value) };
    } else if (types?.includes(xsd.integer.iri)) {
      return { value: parseInt(value) };
    } else {
      const literal: LiteralString = { value };
      if (node["@language"]) {
        literal.language = node["@language"] as string;
      }
      return literal;
    }
  } else if (node["@id"]) {
    const normalized = await initNormalized(node, cache, blanks, propertyMap);
    for (let i = 0, length = normalized.types?.length || 0; i < length; i++) {
      const normalizer = findNormalizer(normalized.types?.[i]);
      await normalizer(node, normalized, cache, blanks, propertyMap);
    }
    const original = (cache[normalized.idLocal] || {}) as Normalized;
    cache[normalized.idLocal] = { ...original, ...normalized };
    return normalized;
  }
};

export const normalize = async (
  jsonArray: JsonLdArray,
  propertyMap: PropertyMap
): Promise<undefined | NormalizeResult> => {
  const blanks: Blanks = {};
  const cache: Cache = {};
  const root = jsonArray?.[0] || {};
  if (!root || Object.keys(root).length === 0) {
    return;
  }
  const { idLocal } = (await normalizeNode(
    root,
    cache,
    blanks,
    propertyMap
  )) as Normalized;
  return joinCache(cache[idLocal], cache);
};
