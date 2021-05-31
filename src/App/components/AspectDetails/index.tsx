import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useAspect } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { MultiLangTexts } from "../MultiLangTexts";
import { Pre } from "../Pre";

interface Props {
  idLocal: string;
}

export const AspectDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = useAspect({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Aspect heading"
          defaultMessage="Aspect: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      {data.text ? (
        <div>
          <Heading level={2}>
            <FormattedMessage
              description="Text content list heading text"
              defaultMessage="Textual content"
            />
          </Heading>
          <div className="flex flex-col">
            <MultiLangTexts texts={data.text} />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="overflow-auto">
        <Pre>{data}</Pre>
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
