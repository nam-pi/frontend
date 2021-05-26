import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { FetchCollectionResult, Item } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Heading } from "../Heading";
import { ItemNav } from "../ItemNav";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { PlaceholderText } from "../PlaceholderText";

interface Props<I extends Item> {
  createLabel?: (item: I) => string;
  fetchResult: FetchCollectionResult<I>;
  itemName: string;
  linkBase: string;
}

export const ItemListSidebar = <I extends Item>({
  createLabel,
  fetchResult: { data, initialized, loading, nav, total, page },
  itemName,
  linkBase,
}: Props<I>) => {
  const getText = useLocaleLiteral();
  return (
    <>
      <Heading>
        {total === undefined ? (
          itemName
        ) : (
          <FormattedMessage
            description="Persons page heading with totals"
            defaultMessage="{itemName} ({total})"
            values={{ itemName, total }}
          />
        )}
      </Heading>
      <ItemNav
        className="my-4"
        disabled={!initialized || loading}
        nav={nav}
        page={page}
      />
      {loading ? (
        <LoadingPlaceholder />
      ) : data ? (
        <ul className="overflow-y-auto">
          {data.map((item: I) => (
            <li className="mb-1 last:mb-0" key={item.idLocal}>
              <Link
                to={"/" + linkBase + "/" + item.idLocal}
                className="text-gray-800"
              >
                {createLabel ? createLabel(item) : getText(item.labels)}
              </Link>
            </li>
          ))}
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
