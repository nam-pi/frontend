import { Source, useSources } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";
import { SourceDetails } from "../SourceDetails";

interface Params {
  idLocal: string;
}

export const SourcesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useSources({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Source>
          linkBase="source"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Sources sidebar list item name",
            defaultMessage: "Sources",
          })}
        />
      }
      main={
        idLocal ? (
          <SourceDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No source selected placeholder"
              defaultMessage="Please select a source"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
