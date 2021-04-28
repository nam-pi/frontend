import { core } from "App/namespaces";
import { Event } from "App/types";

const map = (data: any): Event => {
  const sort =
    data[core.hasSortingDate]?.[0]?.[core.hasXsdDateTime]?.[0]?.["@value"];
  const earliest =
    data[core.takesPlaceNotEarlierThan]?.[0]?.[core.hasXsdDateTime]?.[0]?.[
      "@value"
    ];
  const latest =
    data[core.takesPlaceNotLaterThan]?.[0]?.[core.hasXsdDateTime]?.[0]?.[
      "@value"
    ];
  const exact =
    data[core.takesPlaceOn]?.[0]?.[core.hasXsdDateTime]?.[0]?.["@value"];
  return {
    id: data["@id"],
    type: data["@type"],
    date: {
      sort: sort && new Date(sort),
      earliest: earliest && new Date(earliest),
      latest: latest && new Date(latest),
      exact: exact && new Date(exact),
    },
  };
};

export const event = (data: any[]): Event[] => data.map(map);
