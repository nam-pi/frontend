import { useEventDate } from "App/hooks/useEventDate";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { Person } from "nampi-use-api";
import { useIntl } from "react-intl";

export const usePersonLabel = (): (person: Person) => string => {
  const getDate = useEventDate();
  const getText = useLocaleLiteral();
  const { formatMessage } = useIntl()
  return (person) => {
    const label = getText(person.labels);
    const born = getDate(person.bornIn?.[0], "yearOnly");
    return (
      label +
      (born
        ? ` ${formatMessage(
          {
            description: "Person birth name",
            defaultMessage: "(born {birth})",
          },
          {
            birth: `${born}${(person.bornIn?.length || 0) > 1 ? "[...]" : ""
              }`,
          }
        )} `
        : "")
    );
  }
}