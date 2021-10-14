import { namespaces } from "../../namespaces";
import { MaybeNodes, Normalizer } from "../../types";
import { makeSingle } from "../helpers/transforms";

const { core } = namespaces;

export const normalizeEvent: Normalizer = async (_, normalized, cache) => {
  const exact = cache[normalized.links?.exact?.[0] || ""];
  if (exact) {
    const value = (exact[core.hasDateTime.iri] as MaybeNodes)?.[0]?.value;
    normalized.exact = value;
    delete normalized.links.exact;
  }
  const earliest = cache[normalized.links?.earliest?.[0] || ""];
  if (earliest) {
    const value = (earliest[core.hasDateTime.iri] as MaybeNodes)?.[0]?.value;
    normalized.earliest = value;
    delete normalized.links.earliest;
  }
  const latest = cache[normalized.links?.latest?.[0] || ""];
  if (latest) {
    const value = (latest[core.hasDateTime.iri] as MaybeNodes)?.[0]?.value;
    normalized.latest = value;
    delete normalized.links.latest;
  }
  const sort = cache[normalized.links?.sort?.[0] || ""];
  if (sort) {
    const value = (sort[core.hasDateTime.iri] as MaybeNodes)?.[0]?.value;
    normalized.sort = value;
    delete normalized.links.sort;
  } else {
    normalized.sort =
      normalized.exact || normalized.latest || normalized.earliest;
  }
  makeSingle(normalized, "act");
  makeSingle(normalized, "mainParticipant");
  makeSingle(normalized, "place");
};
