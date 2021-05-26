import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useAspect } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
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
      <div className="mt-4 overflow-auto">
        <Pre>{data}</Pre>
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
