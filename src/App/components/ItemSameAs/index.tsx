import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";

export const ItemSameAs = <
  T extends { item?: Item & { sameAs?: string[] } } = {
    item: Item & { sameAs?: string[] };
  }
>({
  item,
}: T) =>
  item?.sameAs?.length ? (
    <div>
      <Heading level={2}>
        <FormattedMessage
          description="Same as list heading text"
          defaultMessage="Other representations"
        />
      </Heading>
      <div className="flex flex-col">
        {item.sameAs?.map((sameAs, idx) =>
          sameAs.startsWith("http") ? (
            <a href={sameAs} key={idx}>
              {sameAs}
              <FontAwesomeIcon
                className="text-xs ml-2 text-blue-500"
                icon={faLink}
              />
            </a>
          ) : (
            <div>{sameAs}</div>
          )
        )}
      </div>
    </div>
  ) : (
    <></>
  );
