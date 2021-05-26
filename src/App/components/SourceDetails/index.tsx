import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useSource } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Pre } from "../Pre";

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
      <div className="mt-4 overflow-auto">
        <Pre>{data}</Pre>
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
