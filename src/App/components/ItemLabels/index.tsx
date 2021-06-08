import clsx from "clsx";
import { Item } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { MultiLangTexts } from "../MultiLangTexts";

interface Props {
  className?: string;
  item: Item;
}

export const ItemLabels = ({ className, item }: Props) => (
  <div className={clsx(className)}>
    <Heading level={2}>
      <FormattedMessage
        description="Labels list heading text"
        defaultMessage="{labelCount, plural, one {Label} other {Label variants}}"
        values={{ labelCount: item.labels?.length }}
      />
    </Heading>
    <div className="flex flex-col">
      <MultiLangTexts texts={item.labels} />
    </div>
  </div>
);
