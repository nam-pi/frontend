import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useEvents, usePerson } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { serializeEventDates } from "../../utils/serializeEventDates";
import { Heading } from "../Heading";

interface Props {
  idLocal: string;
}

export const PersonDetails = ({ idLocal }: Props) => {
  const getText = useLocaleLiteral();
  const { data } = usePerson({ idLocal });
  const events = useEvents({
    paused: !data,
    query: { orderBy: "date", participant: data?.id },
  });
  return data ? (
    <>
      <Heading>
        <FormattedMessage
          description="Person heading"
          defaultMessage="Person: {label}"
          values={{ label: getText(data.labels) }}
        />
      </Heading>
      <div>
        {events.data?.map((e) => {
          const dateText = serializeEventDates([e]);
          const labelsText = getText(e.labels);
          return (
            <div key={e.idLocal}>
              {dateText ? `${dateText}: ` : ""}
              {labelsText}
            </div>
          );
        })}
      </div>
    </>
  ) : (
    <></>
  );
};
