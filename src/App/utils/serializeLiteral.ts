import { LiteralString } from "nampi-use-api";

export const serializeLiteral = (literals: undefined | LiteralString[]) =>
  (literals || []).map(
    (t) => `${t.value}${t.language ? `@${t.language}` : ""}`
  );
