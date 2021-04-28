import { Label } from "App/types";

const map = (l: any): Label => ({
  value: l["@value"],
  language: l["@language"],
});

export const label = (data: any[]): Label[] => data.map(map);
