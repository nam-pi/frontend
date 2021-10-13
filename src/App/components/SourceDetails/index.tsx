import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useSource } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
}

export const SourceDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = useSource({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Source heading"
          defaultMessage="Source: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <ItemComments item={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
