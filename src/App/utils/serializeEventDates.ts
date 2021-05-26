import { format as fmt } from "date-fns";
import { Event } from "nampi-use-api";

export const serializeEventDates = (
  events: undefined | Event | Event[] = [],
  format = "yyyy-MM-dd",
  separator = ", "
): string => {
  if (events && !Array.isArray(events)) {
    events = [events];
  }
  const dates: string[] = [];
  for (let i = 0, length = events.length; i < length; i++) {
    const event = events[i];
    const dString = event.exact
      ? fmt(event.exact, format)
      : event.earliest && event.latest
        ? `${fmt(event.earliest, format)} - ${fmt(event.latest, format)}`
        : event.earliest
          ? fmt(event.earliest, format)
          : event.latest
            ? fmt(event.latest, format)
            : "";
    if (dString) {
      dates.push(dString);
    }
  }
  return dates.join(separator);
};
