import { PropertyMap } from "../../types";

export const mapKey = (
  map: PropertyMap,
  types: undefined | string[],
  property: string
): string => {
  const itemType = (types || []).find((t) => map[t]);
  const mapped = !itemType ? undefined : map[itemType]?.[property];
  return mapped || property;
};
