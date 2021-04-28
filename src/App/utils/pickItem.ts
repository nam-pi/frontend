import { IResource } from "@hydra-cg/heracles.ts";
import { JsonLdItem } from "App/types";

export const pickItem = <T extends JsonLdItem>(
  resource: IResource,
  items: T[]
): T => {
  const item = items.find((i) => i["@id"] === resource.iri);
  console.log(items);
  if (!item) {
    throw Error(`Failed to pick item '${resource.iri}' from item array.`);
  }
  return item;
};
