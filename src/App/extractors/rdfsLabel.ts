import { rdfs } from "@hydra-cg/heracles.ts";
import { Extractor } from "App/types";

export const rdfsLabel: Extractor<string> = [
  "label",
  (data) => {
    const jsonldLabel = data[rdfs.label];
    return jsonldLabel.map((l: any) => ({
      value: l["@value"],
      language: l["@language"],
    }));
  },
];
