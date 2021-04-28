import { rdfs } from "@hydra-cg/heracles.ts";
import { Extractor, Label } from "App/types";
import { label as labelMapper } from "../mappers/label";

export const rdfsLabel: Extractor<Label[]> = [
  "label",
  (data) => labelMapper(data[rdfs.label] || []),
];
