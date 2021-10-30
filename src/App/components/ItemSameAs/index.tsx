import { faGlobe } from "@fortawesome/free-solid-svg-icons";
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
            <a
              className="hover:opacity-80 flex items-center"
              href={sameAs}
              key={idx}
            >
              {sameAs}
              <FontAwesomeIcon
                className="text-xs ml-1 text-blue-400"
                icon={faGlobe}
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
