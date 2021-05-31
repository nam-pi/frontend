import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useGroup } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { Pre } from "../Pre";

interface Props {
  idLocal: string;
}

export const GroupDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = useGroup({ idLocal });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Group heading"
          defaultMessage="Group: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <div className="overflow-auto">
        <Pre>{data}</Pre>
      </div>
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
