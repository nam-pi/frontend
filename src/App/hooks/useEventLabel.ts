import { Event } from "nampi-use-api";
import { useEventDate } from "./useEventDate";
import { useLocaleLiteral } from "./useLocaleLiteral";

export const useEventLabel = (): (event: Event) => string => {
  const getDate = useEventDate();
  const getText = useLocaleLiteral();
  return (event) => {
    const label = getText(event.labels);
    const date = getDate(event, "yearOnly");
    return date ? `${label} (${date})` : label;
  }
}
