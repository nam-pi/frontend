import { MultilangText } from "nampi-use-api";

export const serializeLabels = <
  T extends { labels: MultilangText[] } = { labels: MultilangText[] }
>(
  data: T
): string => data.labels.map((l) => l.value).join(", ");
