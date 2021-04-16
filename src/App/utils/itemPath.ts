import { API_ENTRYPOINT, PATH_BASES } from "App/constants";
import { ItemType } from "App/enums/ItemType";
import { buildPath } from "./buildPath";

interface Config {
  localId?: string;
  api?: boolean;
}

export const itemPath = (
  type: ItemType,
  { localId, api }: Config = {}
): string => {
  const base = PATH_BASES[localId ? "single" : "collection"][type];
  const start = api ? buildPath(API_ENTRYPOINT, base) : "/" + base;
  return localId === undefined ? start : buildPath(start, localId);
};
