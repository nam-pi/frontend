import { faEraser, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useToggle } from "App/hooks/useToggle";
import { namespaces } from "App/namespaces";
import clsx from "clsx";
import {
  CollectionQuery,
  FetchCollectionResult,
  Item,
  useActs,
  useAspects,
  useAuthors,
  useEvents,
  useGroups,
  usePersons,
  usePlaces,
  useSources,
} from "nampi-use-api";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { Heading } from "../Heading";
import { IconButton } from "../IconButton";
import { ItemNav } from "../ItemNav";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Modal } from "../Modal";
import { PlaceholderText } from "../PlaceholderText";

interface Props<Q extends CollectionQuery, I extends Item = Item> {
  activeItem?: undefined | string;
  createLabel?: (item: I) => string;
  filterSettings?: ReactNode;
  itemName: string;
  itemType: string;
  linkBase: string;
  query?: Q;
  resetQuery?: (query: Q) => void;
}
const { core } = namespaces;

const useData = <I extends Item>(
  type: string,
  query: CollectionQuery
): FetchCollectionResult<I> => {
  const acts = useActs({ paused: type !== core.act, query });
  const aspects = useAspects({ paused: type !== core.aspect, query });
  const authors = useAuthors({ paused: type !== core.author, query });
  const events = useEvents({
    paused: type !== core.event,
    query: query as any,
  });
  const groups = useGroups({ paused: type !== core.group, query });
  const persons = usePersons({ paused: type !== core.person, query });
  const places = usePlaces({ paused: type !== core.place, query });
  const sources = useSources({ paused: type !== core.source, query });
  switch (type) {
    case core.act:
      return acts as FetchCollectionResult<I>;
    case core.aspect:
      return aspects as FetchCollectionResult<I>;
    case core.author:
      return authors as FetchCollectionResult<I>;
    case core.event:
      return events as FetchCollectionResult<I>;
    case core.group:
      return groups as FetchCollectionResult<I>;
    case core.person:
      return persons as FetchCollectionResult<I>;
    case core.place:
      return places as FetchCollectionResult<I>;
    case core.source:
      return sources as FetchCollectionResult<I>;
  }
  throw new Error("Couldn't find data fetch hook for " + type);
};

export const FilterableItemList = <
  I extends Item = Item,
  Q extends CollectionQuery = {}
>({
  activeItem,
  createLabel,
  filterSettings,
  itemName,
  itemType,
  linkBase,
  query,
  resetQuery = () => undefined,
}: Props<Q, I>) => {
  const scrollTimeout = useRef<undefined | NodeJS.Timeout>();
  const listRef = useRef<null | HTMLUListElement>(null);
  const itemRefs = useRef<{ [localId: string]: HTMLLIElement }>({});
  const { formatMessage } = useIntl();
  const initialQuery = useRef<Q>(query || ({} as Q));
  const getText = useLocaleLiteral();
  const [filterActive, toggleFilter] = useToggle();
  const { data, initialized, loading, nav, page, total } = useData<I>(
    itemType,
    query || { orderBy: "label" }
  );
  const filterChanged = useMemo(
    () => JSON.stringify(initialQuery.current) !== JSON.stringify(query),
    [query]
  );

  useEffect(() => {
    if (!initialized || loading || !data) {
      return;
    }
    const scroll = () => {
      if (activeItem) {
        listRef.current?.scrollTo({
          behavior: "smooth",
          top: itemRefs.current[activeItem]?.offsetTop - 200,
        });
      }
    };
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(scroll, 10);
  }, [activeItem, data, initialized, loading]);

  return (
    <>
      <Heading>
        {total === undefined ? (
          itemName
        ) : (
          <FormattedMessage
            description="Item list heading"
            defaultMessage="{itemName} ({total})"
            values={{ itemName, total }}
          />
        )}
      </Heading>
      <div className="flex justify-between items-center">
        <ItemNav
          className="my-4"
          disabled={!initialized || loading}
          nav={nav}
          page={page}
        />
        {filterSettings ? (
          <>
            <div className="text-xs flex space-x-2">
              <IconButton
                className={clsx(filterActive && "bg-gray-100")}
                disabled={loading}
                icon={faFilter}
                label={formatMessage({
                  description: "Item list filter modal toggle button label",
                  defaultMessage: "Toggle filter settings",
                })}
                onClick={toggleFilter}
              />
              {filterChanged ? (
                <IconButton
                  className="bg-red-100"
                  icon={faEraser}
                  label={formatMessage({
                    description: "Item list filter modal toggle button label",
                    defaultMessage: "Toggle filter settings",
                  })}
                  onClick={() => resetQuery(initialQuery.current)}
                />
              ) : (
                <></>
              )}
            </div>
            <Modal
              active={filterActive}
              closeCallback={toggleFilter}
              title={formatMessage({
                description: "Filter settings modal title",
                defaultMessage: "Change filter settings",
              })}
              rightElement={
                filterChanged && (
                  <Button onClick={() => resetQuery(initialQuery.current)}>
                    <FormattedMessage
                      description="Reset button label"
                      defaultMessage="Reset"
                    />
                  </Button>
                )
              }
            >
              {filterSettings}
            </Modal>
          </>
        ) : (
          <></>
        )}
      </div>
      {loading ? (
        <LoadingPlaceholder />
      ) : data ? (
        <ul className="overflow-y-auto" ref={listRef}>
          {data.map((item) => {
            const active = activeItem === item.idLocal;
            return (
              <Link to={"/" + linkBase + "/" + item.idLocal}>
                <li
                  id={item.idLocal}
                  className={clsx(
                    "mb-1",
                    "last:mb-0",
                    "cursor-pointer",
                    "hover:bg-gray-200",
                    active && "bg-gray-100"
                  )}
                  key={item.idLocal}
                  ref={(ref) => (itemRefs.current[item.idLocal] = ref!)}
                >
                  {createLabel ? createLabel(item) : getText(item.labels)}
                </li>
              </Link>
            );
          })}
        </ul>
      ) : (
        <PlaceholderText>
          <FormattedMessage
            description="Empty item list placeholder text"
            defaultMessage="No items available"
          />
        </PlaceholderText>
      )}
    </>
  );
};
