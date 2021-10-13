import { useEntityUrl } from "App/hooks/useEntityUrl";
import { namespaces } from "App/namespaces";
import { Aspect, AspectsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AspectDetails } from "../AspectDetails";
import { AspectEditor } from "../AspectEditor";
import { AspectsFilterSettings } from "../AspectsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

export const AspectsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal, edit } = useEntityUrl();
  const [query, setQuery] = useState<AspectsQuery>({
    orderBy: "label",
    text: "",
    type: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList<Aspect, AspectsQuery>
          activeItem={idLocal}
          filterSettings={
            <AspectsFilterSettings query={query} setQuery={setQuery} />
          }
          heading={formatMessage({
            description: "Aspects sidebar list item name",
            defaultMessage: "Aspects",
          })}
          itemType={namespaces.core.aspect}
          linkBase="aspects"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        edit ? (
          <AspectEditor idLocal={idLocal} />
        ) : idLocal ? (
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
