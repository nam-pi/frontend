import { Blanks, Literal, MaybeNodes, Normalized } from "../../types";
import { isBlank } from "./isBlank";

export const addLinks = (
  normalized: Normalized,
  property: string,
  links: undefined | string | string[],
  blanks: Blanks
): void => {
  let content: string | string[];
  if (!links) {
    return;
  }
  if (Array.isArray(links)) {
    content = (normalized.links[property] as string[]) || [];
    for (let i = 0, length = links.length; i < length; i++) {
      const link = isBlank(links[i]) ? blanks[links[i]] : links[i];
      if (!content.includes(link)) {
        content.push(link);
      }
    }
  } else {
    content = isBlank(links) ? blanks[links] : links;
  }
  normalized.links[property] = content;
};

export const flattenLiteral = (normalized: Normalized, key: string): void => {
  const literal = (normalized[key] as MaybeNodes)?.[0] as undefined | Literal;
  if (literal && literal.value !== undefined) {
    normalized[key] = literal.value;
  }
};

export const makeSingle = (normalized: Normalized, key: string): void => {
  const values = normalized.links[key];
  if (Array.isArray(values) && values.length > 0) {
    normalized.links[key] = values[0];
  }
};
