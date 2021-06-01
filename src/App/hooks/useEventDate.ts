import { Event } from "nampi-use-api";
import { useIntl } from "react-intl";

const getNeutralDate = (date: Date): Date =>
  new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

const isFullYear = (earliest: Date, latest: Date): boolean =>
  earliest.getFullYear() === latest.getFullYear() &&
  earliest.getMonth() === 0 &&
  earliest.getDate() === 1 &&
  latest.getMonth() === 11 &&
  latest.getDate() === 31;

const useFull = (): ((event: Event) => undefined | string) => {
  const { formatMessage, ...intl } = useIntl();
  const formatDate = (date: Date) =>
    intl.formatDate(getNeutralDate(date), { dateStyle: "long" });
  return ({ exact, earliest, latest }) =>
    exact
      ? formatDate(exact)
      : earliest && latest
      ? isFullYear(earliest, latest)
        ? formatMessage(
            {
              description: "Full year content",
              defaultMessage: "sometime in {year}",
            },
            { year: earliest.getFullYear() }
          )
        : formatMessage(
            {
              description: "Date range content",
              defaultMessage: "sometime between {start} and {end}",
            },
            { start: formatDate(earliest), end: formatDate(latest) }
          )
      : earliest
      ? formatMessage(
          {
            description: "Earliest content",
            defaultMessage: "not earlier than {start}",
          },
          { start: formatDate(earliest) }
        )
      : latest
      ? formatMessage(
          {
            description: "Latest content",
            defaultMessage: "not later than {end}",
          },
          { end: formatDate(latest) }
        )
      : undefined;
};

const useShort = (): ((event: Event) => undefined | string) => {
  const intl = useIntl();
  const formatDate = (date: Date) => intl.formatDate(getNeutralDate(date));
  return ({ exact, earliest, latest }) =>
    exact
      ? formatDate(exact)
      : earliest && latest
      ? isFullYear(earliest, latest)
        ? earliest.getFullYear().toString()
        : `${formatDate(earliest)}≬${formatDate(latest)}`
      : earliest
      ? "≥" + formatDate(earliest)
      : latest
      ? "≤" + formatDate(latest)
      : undefined;
};

const useYearOnly =
  (): ((event: Event) => undefined | string) =>
  ({ exact, earliest, latest }) =>
    exact
      ? exact.getFullYear().toString()
      : earliest && latest
      ? earliest.getFullYear() === latest.getFullYear()
        ? `${earliest.getFullYear()}`
        : `${earliest.getFullYear()}≬${latest.getFullYear()}`
      : earliest
      ? "≥" + earliest.getFullYear()
      : latest
      ? "≤" + latest.getFullYear()
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
