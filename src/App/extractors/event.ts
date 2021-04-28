import { Event, Extractor } from "App/types";
import { event as eventMapper } from "../mappers/event";

export const event = (label: string, propType: string): Extractor<Event[]> => {
  return [label, (data) => eventMapper(data[propType] || [])];
};
