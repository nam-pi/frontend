import {
  hydra,
  IHypermediaContainer,
  IPartialCollectionView,
  IResource,
  ITemplatedLink,
  rdfs,
} from "@hydra-cg/heracles.ts";
import { expand } from "jsonld";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_ENTRYPOINT, HYDRA_CLIENT } from "./constants";

const SEARCH_TIMEOUT = 200;

interface Label {
  value: string;
  language?: string;
}

interface Person extends Item {
  label: Label[];
}

interface JsonLdItem {
  "@id": string;
  "@type": string[];
}

interface Item {
  id: string;
  types: string;
}

interface PartialNavigation {
  first: undefined | (() => Promise<void>);
  previous: undefined | (() => Promise<void>);
  next: undefined | (() => Promise<void>);
  last: undefined | (() => Promise<void>);
}

const BASE_URI = `${API_ENTRYPOINT}/persons`;

const extractItem = async <
  T extends object,
  R extends T & JsonLdItem = T & JsonLdItem
>(
  container: IHypermediaContainer
): Promise<R | R[]> => {
  const jsonLd = await container.json();
  const expanded = (await expand(jsonLd))[0];
  const isCollection = expanded["@type"]?.indexOf(hydra.Collection) !== -1;
  const members = (isCollection ? expanded?.[hydra.member] : expanded) as
    | undefined
    | R
    | R[];
  if (!members) {
    throw Error("Failed to find hydra members");
  }
  return members;
};

const pickItem = <T extends JsonLdItem>(resource: IResource, items: T[]): T => {
  const item = items.find((i) => i["@id"] === resource.iri);
  if (!item) {
    throw Error(`Failed to pick item '${resource.iri}' from item array.`);
  }
  return item;
};

const getFromContainer = async <
  T extends object = { [key: string]: any },
  R extends T & JsonLdItem = T & JsonLdItem
>(
  container: IHypermediaContainer,
  member: IResource
): Promise<R> => {
  const items = await extractItem<T, R>(container);
  return pickItem<R>(member, Array.isArray(items) ? items : [items]);
};

const labelExtractor: Extractor<string> = [
  "label",
  (data) => {
    const jsonldLabel = data[rdfs.label];
    return jsonldLabel.map((l: any) => ({
      value: l["@value"],
      language: l["@language"],
    }));
  },
];

type Extractor<T = any> = [
  key: string,
  extract: (data: { [key: string]: any } & JsonLdItem) => T
];

type SearchParams = [key: string, value: number | string][];

const usePartialCollection = <T extends Item>(
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

  const fullExtractors = useMemo(() => [labelExtractor, ...extractors], [
    extractors,
  ]);

  const extractItem = useCallback(
    async (member: IResource, container: IHypermediaContainer) => {
      const rawItem = await getFromContainer(container, member);
      const item: T = ({
        id: rawItem["@id"],
        types: rawItem["@type"],
      } as unknown) as T;
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

const ItemNav = ({ nav }: { nav: PartialNavigation }) => (
  <>
    <button disabled={!nav.first} onClick={nav.first}>
      first
    </button>
    <button disabled={!nav.previous} onClick={nav.previous}>
      previous
    </button>
    <button disabled={!nav.next} onClick={nav.next}>
      next
    </button>
    <button disabled={!nav.last} onClick={nav.last}>
      last
    </button>
  </>
);

export const PersonItem = ({ id, label }: Person) => (
  <li key={id}>
    <a href={id}>
      {label
        .map((l) => `${l.value}${l.language ? ` [${l.language}]` : ""}`)
        .join(", ")}
    </a>
  </li>
);

export const Persons = () => {
  const [text, setText] = useState<string>("");
  const searchParams = useMemo<SearchParams>(() => {
    const params: SearchParams = [];
    if (text) {
      params.push(["http://localhost:4000/vocab#textVariable", text]);
    }
    return params;
  }, [text]);
  const [persons, totalItems, nav] = usePartialCollection<Person>(
    BASE_URI,
    searchParams,
    labelExtractor
  );
  return (
    <div>
      <h1>Persons ({totalItems})</h1>
      <div>
        Filter:{" "}
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div>
      <ul>
        {persons.map((person) => (
          <PersonItem key={person.id} {...person} />
        ))}
      </ul>
      <ItemNav nav={nav} />
    </div>
  );
};
