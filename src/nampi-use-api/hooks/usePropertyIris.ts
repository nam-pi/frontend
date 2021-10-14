import { Item } from "../types";
import { useNampiContext } from "./useNampiContext";

/**
 * Create a function that returns full iris for the given short property keys of a Nampi item object
 * @param item
 * @returns Function that takes a property key that exists in the definition of a given Nampi item. It will then return the correct full IRI of the property or the key itself if the IRI can't be found.
 */
export const usePropertyIris = (
  /** An Nampi item object that will be the source for property key iris */
  item: undefined | Item
): ((key: string) => string) => {
  const { inversePropertyMap } = useNampiContext();
  /**
   * @param key The key on the source Nampi item to get the canonical IRI for
   * @returns The correct full IRI of the property or the key itself if the IRI can't be found.
   */
  return (key: string): string => {
    const type =
      item?.types.find((t) => Object.keys(inversePropertyMap).includes(t)) ||
      "";
    return inversePropertyMap[type]?.[key] || key;
  };
};
