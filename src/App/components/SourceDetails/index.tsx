import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useAuth, useSource } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { DeleteButton } from "../DeleteButton";
import { Heading } from "../Heading";
import { ItemComments } from "../ItemComments";
import { ItemInheritance } from "../ItemInheritance";
import { ItemLabels } from "../ItemLabels";
import { ItemSameAs } from "../ItemSameAs";
import { ItemTexts } from "../ItemTexts";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal: string;
}

export const SourceDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { authenticated } = useAuth();
  const { data } = useSource({ idLocal });
  return data ? (
    <>
      <div className="flex items-center">
        <Heading>
          <FormattedMessage
            description="Source heading"
            defaultMessage="Source: {label}"
            values={{ label: getText(data.labels) }}
          />
        </Heading>
        {authenticated && (
          <>
            <Link
              className="ml-4 text-gray-400"
              to={`/sources/${idLocal}?edit`}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Link>
            <DeleteButton
              entityLabels={data.labels}
              idLocal={idLocal}
              type="sources"
            />
          </>
        )}
      </div>
      <ItemInheritance item={data} />
      <ItemLabels item={data} />
      <ItemTexts item={data} />
      <ItemSameAs item={data} />
      <ItemComments item={data} />
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
