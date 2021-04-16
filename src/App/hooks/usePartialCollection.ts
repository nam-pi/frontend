import {
  hydra,
  IHypermediaContainer,
  IPartialCollectionView,
  IResource,
  ITemplatedLink,
} from "@hydra-cg/heracles.ts";
import { HYDRA_CLIENT, SEARCH_TIMEOUT } from "App/constants";
import { rdfsLabel } from "App/extractors/rdfsLabel";
import { Extractor, Item, PartialNavigation, SearchParams } from "App/types";
import { getFromContainer } from "App/utils/getFromContainer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const usePartialCollection = <T extends Item>(
  startUrl: string,
  search: SearchParams,
  ...extractors: Extractor[]
): [items: T[], totalItems: number, nav: PartialNavigation] => {
  const oldSearch = useRef<SearchParams>(search);
  const searchTimeout = useRef<undefined | NodeJS.Timeout>();
  const [items, setItems] = useState<T[]>([]);
  const [view, setView] = useState<undefined | IPartialCollectionView>();
  const [template, setTemplate] = useState<undefined | ITemplatedLink>();
  const [totalItems, setTotalItems] = useState<number>(0);

  const fullExtractors = useMemo(() => [rdfsLabel, ...extractors], [
    extractors,
  ]);

  const extractItem = useCallback(
    async (member: IResource, container: IHypermediaContainer): Promise<T> => {
      const rawItem = await getFromContainer(container, member);
      const id = rawItem["@id"];
      const idParts = id.split("/");
      const localId = idParts[idParts.length - 1];
      const types = rawItem["@type"];
      const item: T = ({ id, localId, types } as unknown) as T;
      for (const [key, extract] of fullExtractors) {
        (item as any)[key] = extract(rawItem);
      }
      return item;
    },
    [fullExtractors]
  );

  const fetch = useCallback(
    async (target: string | IResource) => {
      const response = await HYDRA_CLIENT.getResource(target);
      const collection = response.collections.first();
      setView(collection.view);
      setTemplate(
        collection.links.ofIri(hydra.search).first() as ITemplatedLink
      );
      const items = [];
      for (const member of collection.members?.toArray() || []) {
        items.push(await extractItem(member, response));
      }
      setItems(items);
      setTotalItems(collection.totalItems);
    },
    [extractItem]
  );

  useEffect(() => {
    if (!view) {
      fetch(startUrl);
    }
  }, [fetch, search, startUrl, view]);

  useEffect(() => {
    if (!view || !template || search === oldSearch.current) {
      return;
    }
    oldSearch.current = search;
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      const finalTarget = template.expandTarget((p) => {
        for (const param of search || []) {
          p.withProperty(param[0]).havingValueOf(param[1]);
        }
        return p;
      });
      fetch(finalTarget);
    }, SEARCH_TIMEOUT);
  }, [fetch, search, template, view]);

  return [
    items,
    totalItems,
    {
      first:
        view?.first && view?.iri !== view?.first?.iri
          ? () => fetch(view.first!)
          : undefined,
      previous: view?.previous ? () => fetch(view.previous!) : undefined,
      next: view?.next ? () => fetch(view.next!) : undefined,
      last:
        view?.last && view?.iri !== view?.last?.iri
          ? () => fetch(view.last!)
          : undefined,
    },
  ];
};
