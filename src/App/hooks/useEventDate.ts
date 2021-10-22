import { Event } from "nampi-use-api";
import { ReactNode } from "react";
import { IntlFormatters, useIntl } from "react-intl";

const isFullYear = (earliest: Date, latest: Date): boolean =>
  earliest.getFullYear() === latest.getFullYear() &&
  earliest.getMonth() === 0 &&
  earliest.getDate() === 1 &&
  latest.getMonth() === 11 &&
  latest.getDate() === 31;

const useDateFormat = (
  config?: Parameters<IntlFormatters<ReactNode, ReactNode>["formatDate"]>[1]
) => {
  const intl = useIntl();
  return (date: Date) => {
    const bce = Math.sign(date.getFullYear()) < 0;
    const absolute = new Date(
      `${Math.abs(date.getFullYear())}-${date.getMonth() + 1}-${date.getDate()}`
    );
    absolute.setFullYear(Math.abs(date.getFullYear()));
    return `${
      config?.format === "year-only"
        ? absolute.getFullYear()
        : intl.formatDate(absolute, config)
    }${
      bce
        ? " " +
          intl.formatMessage({
            description: "BCE abbreviation",
            defaultMessage: "BCE",
          })
        : ""
    }`;
  };
};

const useFull = (): ((event: Event) => undefined | string) => {
  const intl = useIntl();
  const fmt = useDateFormat({ dateStyle: "long" });
  return ({ exact, earliest, latest }) =>
    exact
      ? fmt(exact)
      : earliest && latest
      ? isFullYear(earliest, latest)
        ? intl.formatMessage(
            {
              description: "Full year content",
              defaultMessage: "sometime in {year}",
            },
            { year: earliest.getFullYear() }
          )
        : intl.formatMessage(
            {
              description: "Date range content",
              defaultMessage: "sometime between {start} and {end}",
            },
            { start: fmt(earliest), end: fmt(latest) }
          )
      : earliest
      ? intl.formatMessage(
          {
            description: "Earliest content",
            defaultMessage: "not earlier than {start}",
          },
          { start: fmt(earliest) }
        )
      : latest
      ? intl.formatMessage(
          {
            description: "Latest content",
            defaultMessage: "not later than {end}",
          },
          { end: fmt(latest) }
        )
      : undefined;
};

const useShort = (): ((event: Event) => undefined | string) => {
  const fmt = useDateFormat();
  return ({ exact, earliest, latest }) =>
    exact
      ? fmt(exact)
      : earliest && latest
      ? isFullYear(earliest, latest)
        ? earliest.getFullYear().toString()
        : `${fmt(earliest)}≬${fmt(latest)}`
      : earliest
      ? "≥" + fmt(earliest)
      : latest
      ? "≤" + fmt(latest)
      : undefined;
};

const useYearOnly = (): ((event: Event) => undefined | string) => {
  const fmt = useDateFormat({ format: "year-only" });
  return ({ exact, earliest, latest }) =>
    exact
      ? fmt(exact)
      : earliest && latest
      ? isFullYear(earliest, latest)
        ? earliest.getFullYear().toString()
        : `${fmt(earliest)}≬${fmt(latest)}`
      : earliest
      ? "≥" + fmt(earliest)
      : latest
      ? "≤" + fmt(latest)
      : undefined;
};

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
