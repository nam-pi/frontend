import { Aspect, useAspects } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { AspectDetails } from "../AspectDetails";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const AspectsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useAspects({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Aspect>
          linkBase="aspect"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Aspects sidebar list item name",
            defaultMessage: "Aspects",
          })}
        />
      }
      main={
        idLocal ? (
          <AspectDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No aspect selected placeholder"
              defaultMessage="Please select an aspect"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
