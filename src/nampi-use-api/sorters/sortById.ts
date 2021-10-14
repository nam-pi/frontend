import { Item, SortFunction } from "../types";

export const sortById: SortFunction<Item> = (a, b) => {
  const idA = a.id || a.idLocal;
  const idB = b.id || b.idLocal;
  return idA < idB ? -1 : idA > idB ? 1 : 0;
};
