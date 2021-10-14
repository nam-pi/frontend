import { Entity, SortFunction } from "../types";

const getLabel = (e: Entity): string => {
  let str = "";
  if (!e.labels) {
    return e.idLocal;
  }
  for (let i = 0, length = e.labels.length; i < length; i++) {
    str += e.labels[i].value;
  }
  return str.toLocaleLowerCase();
};

export const sortByLabel: SortFunction<Entity> = (a, b) => {
  const labA = getLabel(a);
  const labB = getLabel(b);
  return labA < labB ? -1 : labA > labB ? 1 : 0;
};
