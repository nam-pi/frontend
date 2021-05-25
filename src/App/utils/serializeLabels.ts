import { LiteralString } from "nampi-use-api";

export const serializeLabels = <
  T extends { labels?: undefined | LiteralString[] } = {
    labels?: undefined | LiteralString[];
  }
>(
  data: undefined | T
): string => (data?.labels ? data.labels.map((l) => l.value).join(", ") : "");
