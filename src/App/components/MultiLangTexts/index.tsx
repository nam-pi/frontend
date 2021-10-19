import {
    faAngleDoubleLeft,
    faAngleDoubleRight
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { LiteralString } from "nampi-use-api";
import { useIntl } from "react-intl";
import { Icon } from "../Icon";

interface Props {
  className?: string;
  texts: undefined | LiteralString | LiteralString[];
}

interface InternalProps {
  className?: string;
  texts: LiteralString | LiteralString[];
}

const Texts = ({ className, texts }: InternalProps) => {
  const { formatDisplayName, formatMessage } = useIntl();
  return (
    <>
      {(Array.isArray(texts) ? texts : [texts])
        .map<{ value: string; language: string }>(({ value, language }) => ({
          value,
          language: language
            ? (formatDisplayName(language, { type: "language" }) as string)
            : formatMessage({
                description: "No language placeholder",
                defaultMessage: "No language",
              }),
        }))
        .sort(
          (
            { value: valA, language: langA = "" },
            { value: valB, language: langB = "" }
          ) =>
            langA < langB
              ? -1
              : langA > langB
              ? 1
              : valA < valB
              ? -1
              : valA > valB
              ? 1
              : 0
        )
        .map(({ value, language }, idx) => {
          return (
            <div key={idx} className={clsx(className, "inline-block")}>
              <Icon
                className="text-xs text-gray-500 mr-1"
                icon={faAngleDoubleRight}
              />
              <span className="font-mono">{value}</span>
              <Icon
                className="text-xs text-gray-500 mx-1"
                icon={faAngleDoubleLeft}
              />
              <span className="text-gray-400">({language})</span>
            </div>
          );
        })}
    </>
  );
};

export const MultiLangTexts = ({ className, texts }: Props) => (
  <>{texts ? <Texts className={className} texts={texts} /> : <></>}</>
);
