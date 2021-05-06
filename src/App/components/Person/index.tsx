import { useEvents, usePerson } from "nampi-use-api";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router";
import { serializeEventDates } from "../../utils/serializeEventDates";
import { serializeLabels } from "../../utils/serializeLabels";
import { Heading } from "../Heading";

interface Params {
  idLocal: string;
}

export const Person = () => {
  const { idLocal } = useParams<Params>();
  const { data } = usePerson({ idLocal });
  const events = useEvents({
    paused: !data,
    query: { orderBy: "date", participant: data?.id },
  });
  return data ? (
    <div>
      <Heading>
        <FormattedMessage
          description="Person heading"
          defaultMessage="Person: {label}"
          values={{ label: serializeLabels(data) }}
        />
      </Heading>
      <div>
        {events.data?.map((e) => {
          const dateText = serializeEventDates([e]);
          const labelsText = serializeLabels(e);
          return (
            <div key={e.idLocal}>
              {dateText ? `${dateText}: ` : ""}
              {labelsText}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
};
