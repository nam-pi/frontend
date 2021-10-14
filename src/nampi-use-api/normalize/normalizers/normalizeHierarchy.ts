import { flatten, NodeObject, ValueObject } from "jsonld";
import { namespaces } from "../../namespaces";
import {
    LiteralString,
    MaybeNodes,
    Normalizer,
    PropertyMap
} from "../../types";
import { mapKey } from "../helpers/mapKey";

interface LookupMap {
  [id: string]: NodeObject;
}

type Path = string[];
type Objects = NodeObject[];
interface PathMap {
  [id: string]: Path;
}
const { api, rdfs } = namespaces;

/** Get the ids of all endpoint items (items that don't have ancestors) */
const findEndPointIds = (flatObjects: Objects): string[] => {
  const endpoints: string[] = [];
  for (let i = 0, length = flatObjects.length; i < length; i++) {
    if (flatObjects[i]["@type"]?.includes(api.hierarchy.iri)) {
      continue;
    }
    if (!flatObjects[i][api.descendantOf.iri]) {
      const id = flatObjects[i]["@id"];
      if (id) {
        endpoints.push(id);
      }
    }
  }
  return endpoints;
};

/** Wrap the list of objects in a map indexed by the items' ids */
const createMap = (flatObjects: Objects): LookupMap => {
  const map: LookupMap = {};
  for (let i = 0, length = flatObjects.length; i < length; i++) {
    const id = flatObjects[i]["@id"];
    if (id) {
      map[id] = flatObjects[i];
    }
  }
  return map;
};

/** Recursive find possible paths through through the list of the objects ancestors */
const findPaths = (
  object: NodeObject,
  objects: LookupMap,
  path: Path,
  paths: Path[]
) => {
  const id = object["@id"] as string;
  const pathCopy = [...path];
  pathCopy.push(id);
  paths.push(pathCopy);
  const descendants = (object[api.descendantOf.iri] || []) as Objects;
  const ancestors = (object[api.ancestorOf.iri] || []) as Objects;
  const items = ancestors.length > 0 ? ancestors : descendants;
  for (let i = 0, length = items.length; i < length; i++) {
    const next = objects[items[i]["@id"] || ""];
    findPaths(next, objects, pathCopy, paths);
  }
};

/** Remove all paths that don't end at an endpoint */
const pruneEndpointPaths = (paths: Path[], endpoints: string[]): Path[] => {
  const pruned: Path[] = [];
  for (let i = 0, length = paths.length; i < length; i++) {
    const path = paths[i];
    if (endpoints.includes(path[path.length - 1])) {
      pruned.push(path);
    }
  }
  return pruned;
};

/** Create a map of paths indexed by their array position */
const createPathMap = (paths: Path[]): PathMap => {
  const map: PathMap = {};
  for (let i = 0, length = paths.length; i < length; i++) {
    map[String(i)] = paths[i];
  }
  return map;
};

/** Remove all but the longest possible paths for all objects */
const pruneShortPaths = (paths: Path[], flatObjects: Objects): Path[] => {
  const keyedPaths: PathMap = createPathMap(paths);
  const pruned: PathMap = {};
  for (let j = 0, jLength = flatObjects.length; j < jLength; j++) {
    const object = flatObjects[j];
    const best = findBestPath(object, keyedPaths);
    if (best) {
      pruned[best] = keyedPaths[best];
    }
  }
  return Object.values(pruned);
};

/** Find the best (=longest) path for for an object  */
const findBestPath = (object: NodeObject, paths: PathMap): string => {
  const keys = Object.keys(paths);
  let bestPath = "";
  let bestLength = 0;
  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i];
    const path = paths[key];
    const containsObject = path.includes(object["@id"] || "");
    if (containsObject) {
      const length = path.length;
      if (length > bestLength) {
        bestLength = length;
        bestPath = key;
      }
    }
  }
  return bestPath;
};

/** Add the paths and create the final hierarchy object with manually de-normalized labels and other properties */
const deNormalizePaths = (
  paths: Path[],
  objects: LookupMap,
  propertyMap: PropertyMap
) => {
  for (let i = 0, iLength = paths.length; i < iLength; i++) {
    const path = paths[i];
    for (let j = 0, jLength = path.length; j < jLength; j++) {
      const current = path[j];
      const previous = j > 0 ? path[j - 1] : undefined;
      const next = j < jLength - 1 ? path[j + 1] : undefined;
      const object = objects[current];
      const labelKey = mapKey(
        propertyMap,
        object["@type"] as string[],
        rdfs.label.iri
      );
      (object as Record<string, unknown>)[labelKey] = [
        ...((object[rdfs.label.iri] as undefined | ValueObject[]) || []),
      ].map<LiteralString>((node) => ({
        value: node["@value"] as string,
        language: (node as Record<string, unknown>)["@language"] as
          | undefined
          | string,
      }));
      const descendantOfKey = mapKey(
        propertyMap,
        object["@type"] as string[],
        api.descendantOf.iri
      );
      object[descendantOfKey] = [
        ...((object[api.descendantOf.iri] as MaybeNodes) || []),
      ].map((node) => node["@id"] as string);
      const children = (object.children || []) as string[];
      if (previous && !children.includes(previous)) {
        children.push(previous);
      }
      object.children = children;
      const parents = (object.parents || []) as string[];
      if (next && !parents.includes(next)) {
        parents.push(next);
      }
      object.parents = parents;
    }
  }
};

export const normalizeHierarchy: Normalizer = async (
  node,
  normalized,
  _,
  __,
  propertyMap
) => {
  const root = (node[api.hierarchyRoot.iri] as MaybeNodes)?.[0];
  const flat = await flatten(node);
  if (Array.isArray(flat)) {
    const rootId = root?.["@id"] as string;
    const map = createMap(flat);
    delete map[node["@id"] || ""];
    if (root) {
      const paths: Path[] = [];
      findPaths(map[rootId], map, [], paths);
      const endpoints = findEndPointIds(flat);
      const pruned = pruneEndpointPaths(paths, endpoints);
      const best = pruneShortPaths(pruned, flat);
      deNormalizePaths(best, map, propertyMap);
      normalized.root = rootId;
      normalized.items = map;
      normalized.paths = best;
      delete normalized.links.root;
    }
  }
};
