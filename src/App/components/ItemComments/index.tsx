import clsx from "clsx";
import { Item } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { MultiLangTexts } from "../MultiLangTexts";

interface Props {
  className?: string;
  item: Item;
}

export const ItemComments = ({ className, item }: Props) => (
  <div className={clsx(className)}>
    <Heading level={2}>
      <FormattedMessage
        description="Comments list heading text"
        defaultMessage="{labelCount, plural, one {Comment} other {Comment variants}}"
        values={{ labelCount: item.comments?.length }}
      />
    </Heading>
    <div className="flex flex-col">
      <MultiLangTexts texts={item.comments} />
    </div>
  </div>
);
