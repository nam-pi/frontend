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
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Button } from "../Button";
import { Heading, Props as HeadingProps } from "../Heading";
import { IconButton } from "../IconButton";
import { ItemNav } from "../ItemNav";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Modal } from "../Modal";
import { PlaceholderText } from "../PlaceholderText";

interface Props<Q extends CollectionQuery, I extends Item = Item> {
  activeItem?: undefined | string;
  className?: string;
  compact?: boolean;
  createLabel?: (item: I) => string;
  defaultQuery?: Q;
  filterSettings?: ReactNode;
  forceEmpty?: boolean;
  heading: string;
  headingLevel?: HeadingProps["level"];
  itemType: string;
  linkBase: string;
  paused?: boolean;
  query?: Q;
  resetQuery?: (query: Q) => void;
}

const { core } = namespaces;

const useData = <I extends Item>(
  type: string,
  query: CollectionQuery,
  paused: undefined | boolean
): FetchCollectionResult<I> => {
  const acts = useActs({ paused: paused || type !== core.act, query });
  const aspects = useAspects({ paused: paused || type !== core.aspect, query });
  const authors = useAuthors({ paused: paused || type !== core.author, query });
  const events = useEvents({
    paused: paused || type !== core.event,
    query: query as any,
  });
  const groups = useGroups({ paused: paused || type !== core.group, query });
  const persons = usePersons({ paused: paused || type !== core.person, query });
  const places = usePlaces({ paused: paused || type !== core.place, query });
  const sources = useSources({ paused: paused || type !== core.source, query });
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
  className,
  compact,
  createLabel,
  filterSettings,
  forceEmpty,
  heading,
  headingLevel = 1,
  itemType,
  linkBase,
  query,
  defaultQuery,
  resetQuery = () => undefined,
  paused,
}: Props<Q, I>) => {
  const scrollTimeout = useRef<undefined | NodeJS.Timeout>();
  const listRef = useRef<null | HTMLUListElement>(null);
  const itemRefs = useRef<{ [localId: string]: HTMLLIElement }>({});
  const { formatMessage } = useIntl();
  const getText = useLocaleLiteral();
  const [filterActive, toggleFilter] = useToggle();
  const [initialQuery, setInitialQuery] = useState<Q>(
    defaultQuery || query || ({} as Q)
  );
  const filterChanged = useMemo(
    () => JSON.stringify(initialQuery) !== JSON.stringify(query),
    [initialQuery, query]
  );
  const { data, initialized, loading, nav, page, total } = useData<I>(
    itemType,
    query || { orderBy: "label" },
    paused
  );

  useEffect(() => {
    if (defaultQuery) {
      setInitialQuery(defaultQuery);
    }
  }, [defaultQuery]);

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
    <div className={clsx(className, "flex flex-col sm:h-full")}>
      <Heading level={headingLevel}>
        <FormattedMessage
          description="Item list heading"
          defaultMessage="{total, plural, =0 {{heading}} other {{heading} ({total})}}"
          values={{ heading, total: total || 0 }}
        />
      </Heading>
      <div className="flex justify-between items-center">
        <ItemNav
          className={compact ? "my-2" : "my-4"}
          disabled={!initialized || loading}
          nav={nav}
          page={page}
        />
        {filterSettings && (
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
            {filterChanged && (
              <IconButton
                className="bg-red-100"
                icon={faEraser}
                label={formatMessage({
                  description: "Item list filter modal toggle button label",
                  defaultMessage: "Toggle filter settings",
                })}
                onClick={() => resetQuery(initialQuery)}
              />
            )}
          </div>
        )}
      </div>
      {filterActive && (
        <Modal
          active={true}
          closeCallback={toggleFilter}
          title={formatMessage({
            description: "Filter settings modal title",
            defaultMessage: "Change filter settings",
          })}
          rightElement={
            filterChanged && (
              <Button onClick={() => resetQuery(initialQuery)}>
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
      )}
      {loading ? (
        <LoadingPlaceholder />
      ) : data && !forceEmpty ? (
        <ul className="overflow-y-auto" ref={listRef}>
          {data.map((item) => {
            const active = activeItem === item.idLocal;
            return (
              <li
                key={item.idLocal}
                id={item.idLocal}
                className={clsx(
                  "mb-1",
                  "last:mb-0",
                  "cursor-pointer",
                  "hover:bg-gray-200",
                  active && "bg-gray-100"
                )}
                ref={(ref) => (itemRefs.current[item.idLocal] = ref!)}
              >
                <Link
                  className="w-full inline-block"
                  key={item.id}
                  to={"/" + linkBase + "/" + item.idLocal}
                >
                  {createLabel ? createLabel(item) : getText(item.labels)}
                </Link>
              </li>
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
    </div>
  );
};
