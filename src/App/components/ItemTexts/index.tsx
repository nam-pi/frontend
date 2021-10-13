import { LiteralString } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { MultiLangTexts } from "../MultiLangTexts";

export const ItemTexts = <
  T extends { item?: { texts?: LiteralString[] } } = {
    item: { texts?: LiteralString[] };
  }
>({
  item,
}: T) =>
  item?.texts?.length ? (
    <div>
      <Heading level={2}>
        <FormattedMessage
          description="Texts list list heading text"
          defaultMessage="{textCount, plural, one {Text content} other {Text content variants}}"
          values={{ textCount: item?.texts?.length }}
        />
      </Heading>
      <div className="flex flex-col">
        <MultiLangTexts texts={item?.texts} />
      </div>
    </div>
  ) : (
    <></>
  );
