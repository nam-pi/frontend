import { hydra, IHypermediaContainer } from "@hydra-cg/heracles.ts";
import { JsonLdItem } from "App/types";
import { expand } from "jsonld";

export const extractItem = async <
  T extends object,
  R extends T & JsonLdItem = T & JsonLdItem
>(
  container: IHypermediaContainer
): Promise<R | R[]> => {
  const jsonLd = await container.json();
  const expanded = (await expand(jsonLd))[0];
  const isCollection = expanded["@type"]?.indexOf(hydra.Collection) !== -1;
  const members = (isCollection ? expanded?.[hydra.member] : expanded) as
    | undefined
    | R
    | R[];
  if (!members) {
    throw Error("Failed to find hydra members");
  }
  return members;
};
