import { Event } from "nampi-use-api";
import { useIntl } from "react-intl";

const useFull = (): ((event: Event) => undefined | string) => {
  const { formatDate, formatMessage } = useIntl();
  return ({ exact, earliest, latest }) =>
    exact
      ? formatDate(exact)
      : earliest && latest
      ? formatMessage(
          {
            description: "Date range content",
            defaultMessage: "between {start} and {end}",
          },
          { start: formatDate(earliest), end: formatDate(latest) }
        )
      : earliest
      ? formatMessage(
          { description: "Earliest content", defaultMessage: "after {start}" },
          { start: formatDate(earliest) }
        )
      : latest
      ? formatMessage(
          { description: "Latest content", defaultMessage: "before {end}" },
          { end: formatDate(earliest) }
        )
      : undefined;
};

const useShort = (): ((event: Event) => undefined | string) => {
  const { formatDate } = useIntl();
  return ({ exact, earliest, latest }) =>
    exact
      ? formatDate(exact)
      : earliest && latest
      ? `${formatDate(earliest)}~${formatDate(latest)}`
      : earliest
      ? formatDate(earliest) + "~"
      : latest
      ? "~" + formatDate(latest)
      : undefined;
};

const useYearOnly =
  (): ((event: Event) => undefined | string) =>
  ({ exact, earliest, latest }) =>
    exact
      ? exact.getUTCFullYear().toString()
      : earliest && latest
      ? earliest.getUTCFullYear() === latest.getUTCFullYear()
        ? earliest.getUTCFullYear().toString()
        : `${earliest.getUTCFullYear()}~${latest.getUTCFullYear()}`
      : earliest
      ? earliest.getUTCFullYear() + "~"
      : latest
      ? "~" + latest.getUTCFullYear()
      : undefined;

export const useEventDate = (): ((
  event: undefined | Event,
  style?: "full" | "short" | "yearOnly"
) => undefined | string) => {
  const full = useFull();
  const short = useShort();
  const yearOnly = useYearOnly();
  return (event, style = "full") =>
    event
      ? (style === "full" ? full : style === "short" ? short : yearOnly)(event)
      : undefined;
};
