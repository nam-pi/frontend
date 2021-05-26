import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { serializeEventDates } from "App/utils/serializeEventDates";
import { Person, usePersons } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ItemListSidebar } from "../ItemListSidebar";
import { PersonDetails } from "../PersonDetails";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const PersonsPage = () => {
  const getText = useLocaleLiteral();
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = usePersons({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Person>
          createLabel={(person) => {
            const label = getText(person.labels);
            const born = serializeEventDates(person.bornIn, "Y");
            return label + (born ? ` (${born})` : "");
          }}
          linkBase="person"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Person sidebar list item name",
            defaultMessage: "Persons",
          })}
        />
      }
      main={
        idLocal ? (
          <PersonDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No person selected placeholder"
              defaultMessage="Please select a person"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
