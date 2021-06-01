import { namespaces } from "App/namespaces";
import { SourcesQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";
import { SourceDetails } from "../SourceDetails";
import { SourcesFilterSettings } from "../SourcesFilterSettings";

interface Params {
  idLocal: string;
}

export const SourcesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<SourcesQuery>({
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
            <SourcesFilterSettings query={query} setQuery={setQuery} />
          }
          heading={formatMessage({
            description: "Sources sidebar list item name",
            defaultMessage: "Sources",
          })}
          itemType={namespaces.core.source}
          linkBase="source"
          query={query}
          resetQuery={setQuery}
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
