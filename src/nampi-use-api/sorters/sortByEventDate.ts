import { Event, SortFunction } from "../types";

export const sortByEventDate: SortFunction<Event> = (a, b) => {
  const dateA = a.sort || new Date();
  const DateB = b.sort || new Date();
  return dateA < DateB ? -1 : dateA > DateB ? 1 : 0;
};
