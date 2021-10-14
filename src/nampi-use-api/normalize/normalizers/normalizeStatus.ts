import { MaybeNodes, Normalizer } from "../../types";

export const normalizeStatus: Normalizer = async (_, normalized) => {
  normalized.code = Number((normalized.code as MaybeNodes)?.[0].value);
};
