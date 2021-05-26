import { Act, useActs } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ActDetails } from "../ActDetails";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const ActsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useActs({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Act>
          linkBase="act"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Acts sidebar list item name",
            defaultMessage: "Acts",
          })}
        />
      }
      main={
        idLocal ? (
          <ActDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No act selected placeholder"
              defaultMessage="Please select an document interpretation act"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
