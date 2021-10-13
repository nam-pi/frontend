import { useEntityUrl } from "App/hooks/useEntityUrl";
import { namespaces } from "App/namespaces";
import { GroupsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { FilterableItemList } from "../FilterableItemList";
import { GroupDetails } from "../GroupDetails";
import { GroupEditor } from "../GroupEditor";
import { GroupsFilterSettings } from "../GroupsFilterSettings";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

export const GroupsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal, edit } = useEntityUrl();
  const [query, setQuery] = useState<GroupsQuery>({
    orderBy: "label",
    text: "",
    type: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          filterSettings={
            <GroupsFilterSettings query={query} setQuery={setQuery} />
          }
          heading={formatMessage({
            description: "Groups sidebar list item name",
            defaultMessage: "Groups",
          })}
          itemType={namespaces.core.group}
          linkBase="groups"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        edit ? (
          <GroupEditor idLocal={idLocal} />
        ) : idLocal ? (
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
