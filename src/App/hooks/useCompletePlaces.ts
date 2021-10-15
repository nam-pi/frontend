import { Place } from "nampi-use-api";
import { useEffect, useMemo, useRef, useState } from "react";

const GEONAMES_ID_REGEX = /.*?geonames.*?(?<id>\d{1,9}).*$/;
const GEONAMES_LAT_REGEX = /<wgs84_pos:lat>(.+)<\/wgs84_pos:lat>/;
const GEONAMES_LNG_REGEX = /<wgs84_pos:long>(.+)<\/wgs84_pos:long>/;

const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => {
  return value !== null && value !== undefined;
};

export const addPosition = async (place: Place) => {
  const { latitude, longitude, sameAs } = place;
  if ((latitude && longitude) || !sameAs) {
    return place;
  }
  const geonameUrl = sameAs
    .map((sa) => {
      const id = GEONAMES_ID_REGEX.exec(sa)?.[1] as undefined | string;
      return id ? `https://sws.geonames.org/${id}/about.rdf` : undefined;
    })
    .filter(notEmpty)?.[0];
  if (geonameUrl) {
    return fetch(geonameUrl)
      .then((response) => response.text())
      .then((text) => {
        const lat = GEONAMES_LAT_REGEX.exec(text)?.[1] || null;
        const lng = GEONAMES_LNG_REGEX.exec(text)?.[1] || null;
        return lat !== null && lng !== null
          ? { ...place, latitude: Number(lat), longitude: Number(lng) }
          : place;
      });
  } else {
    return place;
  }
};

export const useCompletePlaces = (
  places: undefined | Place | Place[] = []
): [places: Place[], loading: boolean] => {
  const placeArray = useMemo(
    () => (Array.isArray(places) ? places : [places]),
    [places]
  );
  const oldPlaces = useRef(placeArray);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<typeof placeArray>([]);
  useEffect(() => {
    if (!loading && oldPlaces.current !== placeArray) {
      oldPlaces.current = placeArray;
      setLoading(true);
      const load = async () => {
        Promise.all(placeArray.map(addPosition))
          .then(setData)
          .then(() => setLoading(false));
      };
      load();
    }
  }, [data, loading, placeArray]);
  return [data, loading];
};
