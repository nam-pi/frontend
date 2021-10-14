import { namespaces } from "../../namespaces";
import { MaybeNodes, Normalizer } from "../../types";
import { flattenLiteral } from "../helpers/transforms";

const { hydra } = namespaces;

const LIMIT_REGEX = /(?:limit=(?<limit>\d*))/;
const OFFSET_REGEX = /(?:offset=(?<offset>\d*))/;

const getPage = (url: string) => {
  const limit = Number(url.match(LIMIT_REGEX)?.groups?.limit || 1);
  const offset = Number(url.match(OFFSET_REGEX)?.groups?.offset || 0);
  return Math.floor(offset / limit + 1);
};

export const normalizeCollection: Normalizer = async (node, normalized) => {
  const view = (node[hydra.view.iri] as MaybeNodes)?.[0];
  if (view) {
    const first = view[hydra.first.iri] as MaybeNodes;
    if (first) {
      normalized.first = first[0]?.["@id"];
    }
    const previous = view[hydra.previous.iri] as MaybeNodes;
    if (previous) {
      normalized.previous = previous[0]?.["@id"];
    }
    const next = view[hydra.next.iri] as MaybeNodes;
    if (next) {
      normalized.next = next[0]?.["@id"];
    }
    const last = view[hydra.last.iri] as MaybeNodes;
    if (last) {
      normalized.last = last[0]?.["@id"];
    }
    normalized.page = getPage(view["@id"] as string);
  }
  flattenLiteral(normalized, "total");
};
