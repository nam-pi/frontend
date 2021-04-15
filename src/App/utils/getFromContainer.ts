import { IHypermediaContainer, IResource } from "@hydra-cg/heracles.ts";
import { JsonLdItem } from "App/types";
import { extractItem } from "./extractItem";
import { pickItem } from "./pickItem";

export const getFromContainer = async <
  T extends object = { [key: string]: any },
  R extends T & JsonLdItem = T & JsonLdItem
>(
  container: IHypermediaContainer,
  member: IResource
): Promise<R> => {
  const items = await extractItem<T, R>(container);
  return pickItem<R>(member, Array.isArray(items) ? items : [items]);
};
