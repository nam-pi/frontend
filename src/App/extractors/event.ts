import { core } from "App/namespaces";
import { Event, Extractor } from "App/types";

export const event = (label: string, propType: string): Extractor<Event[]> => {
  return [
    label,
    (data) => {
      return (data[propType] || []).map(
        (raw: any): Event => {
          const sort =
            raw[core.hasSortingDate]?.[0]?.[core.hasXsdDateTime]?.[0]?.[
              "@value"
            ];
          const earliest =
            raw[core.takesPlaceNotEarlierThan]?.[0]?.[
              core.hasXsdDateTime
            ]?.[0]?.["@value"];
          const latest =
            raw[core.takesPlaceNotLaterThan]?.[0]?.[core.hasXsdDateTime]?.[0]?.[
              "@value"
            ];
          const exact =
            raw[core.takesPlaceOn]?.[0]?.[core.hasXsdDateTime]?.[0]?.["@value"];
          return {
            "@id": raw["@id"],
            "@type": raw["@types"],
            date: {
              sort: sort && new Date(sort),
              earliest: earliest && new Date(earliest),
              latest: latest && new Date(latest),
              exact: exact && new Date(exact),
            },
          };
        }
      );
    },
  ];
};
