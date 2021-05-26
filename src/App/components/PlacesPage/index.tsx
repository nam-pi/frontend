import { Place, usePlaces } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceDetails } from "../PlaceDetails";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const PlacesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = usePlaces({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Place>
          linkBase="place"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Places sidebar list item name",
            defaultMessage: "Places",
          })}
        />
      }
      main={
        idLocal ? (
          <PlaceDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No place selected placeholder"
              defaultMessage="Please select a place"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
