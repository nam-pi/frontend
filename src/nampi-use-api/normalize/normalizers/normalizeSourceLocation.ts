import { Normalizer } from "../../types";
import { flattenLiteral, makeSingle } from "../helpers/transforms";

export const normalizeSourceLocation: Normalizer = async (_, normalized) => {
  flattenLiteral(normalized, "text");
  makeSingle(normalized, "source");
};
