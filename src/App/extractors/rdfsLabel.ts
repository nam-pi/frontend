import { rdfs } from "@hydra-cg/heracles.ts";
import { Extractor } from "App/types";

export const rdfsLabel: Extractor<string> = [
  "label",
  (data) => {
    return (data[rdfs.label] || []).map((l: any) => ({
      value: l["@value"],
      language: l["@language"],
    }));
  },
];
