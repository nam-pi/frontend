import { namespaces } from "App/namespaces";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ActDetails } from "../ActDetails";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const ActsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          itemName={formatMessage({
            description: "Acts sidebar list item name",
            defaultMessage: "Acts",
          })}
          itemType={namespaces.core.act}
          linkBase="act"
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
