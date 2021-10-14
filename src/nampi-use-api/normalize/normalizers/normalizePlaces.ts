import { MaybeNodes, Normalizer } from "../../types";

export const normalizePlaces: Normalizer = async (_, normalized) => {
  normalized.latitude = Number((normalized.latitude as MaybeNodes)?.[0]?.value);
  normalized.longitude = Number(
    (normalized.longitude as MaybeNodes)?.[0]?.value
  );
};
