import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { usePerson } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { Heading } from "../Heading";
import { LoadingPlaceholder } from "../LoadingPlaceholder";

interface Props {
  idLocal?: string;
}

export const PersonEditor = ({ idLocal }: Props) => {
  const { data } = usePerson({ idLocal: idLocal || "", paused: !idLocal });
  const literal = useLocaleLiteral();
  const create = idLocal === undefined;
  return data ? (
    <>
      <Heading>
        {create ? (
          <FormattedMessage
            description="Create person heading"
            defaultMessage="Create new person"
          />
        ) : (
          <FormattedMessage
            description="New person heading"
            defaultMessage="Edit {person}"
            values={{ person: literal(data.labels) }}
          />
        )}
      </Heading>
      TODO: Content
    </>
  ) : (
    <LoadingPlaceholder />
  );
};
