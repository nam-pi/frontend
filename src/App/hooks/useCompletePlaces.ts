import { notEmpty } from "App/utils/notEmpty";
import { Place } from "nampi-use-api";
import { useEffect, useMemo, useRef, useState } from "react";

const GEONAMES_ID_REGEX = /.*?geonames.*?(?<id>\d{1,9}).*$/;
const GEONAMES_LAT_REGEX = /<wgs84_pos:lat>(.+)<\/wgs84_pos:lat>/;
const GEONAMES_LNG_REGEX = /<wgs84_pos:long>(.+)<\/wgs84_pos:long>/;

type MaybePlace = undefined | Place;

export const addPosition = async (place: MaybePlace): Promise<MaybePlace> => {
  if (!place) {
    return;
  }
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

export const useCompletePlace = (place: MaybePlace): [MaybePlace, boolean] => {
  const places = useMemo(() => [place], [place]);
  const data = useCompletePlaces(places);
  return [data[0][0], data[1]];
};

export const useCompletePlaces = (
  places: MaybePlace[] = []
): [places: MaybePlace[], loading: boolean] => {
  const oldPlaces = useRef<MaybePlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MaybePlace[]>([]);
  useEffect(() => {
    if (oldPlaces.current !== places) {
      oldPlaces.current = places;
      if (!loading) {
        setLoading(true);
      }
      const load = async () => {
        Promise.all(places.map(addPosition))
          .then(setData)
          .then(() => {
            setLoading(false);
          });
      };
      load();
    }
  }, [loading, places]);
  return [data, loading];
};
