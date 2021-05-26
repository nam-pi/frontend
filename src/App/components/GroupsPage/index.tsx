import { Group, useGroups } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { GroupDetails } from "../GroupDetails";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const GroupsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useGroups({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Group>
          linkBase="group"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Groups sidebar list item name",
            defaultMessage: "Groups",
          })}
        />
      }
      main={
        idLocal ? (
          <GroupDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No group selected placeholder"
              defaultMessage="Please select a group"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
