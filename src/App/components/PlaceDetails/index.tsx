import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { usePlace } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Pre } from "../Pre";

interface Props {
  idLocal: string;
}

export const PlaceDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = usePlace({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Place heading"
          defaultMessage="Place: {label}"
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