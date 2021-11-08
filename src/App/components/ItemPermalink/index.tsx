import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Item } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { IconButton } from "../IconButton";

interface Props {
  item: Item;
}

export const ItemPermalink = ({ item }: Props) => {
  const intl = useIntl();
  return (
    <div className="text-xs">
      <FormattedMessage
        description="Permalink text"
        defaultMessage="Permalink: {url} {copy}"
        values={{
          url: item.id,
          copy: (
            <IconButton
              className="border-transparent text-gray-500"
              icon={faCopy}
              label={intl.formatMessage({
                description: "Copy button label",
                defaultMessage: "Copy permalink",
              })}
              onClick={() => navigator.clipboard.writeText(item.id)}
            />
          ),
        }}
      />
    </div>
  );
};
