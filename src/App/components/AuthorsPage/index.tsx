import { namespaces } from "App/namespaces";
import { AuthorsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { AuthorDetails } from "../AuthorDetails";
import { AuthorsFilterSettings } from "../AuthorsFilterSettings";
import { FilterableItemList } from "../FilterableItemList";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const AuthorsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<AuthorsQuery>({
    orderBy: "label",
    text: "",
  });
  return (
    <SidebarPage
      sidebar={
        <FilterableItemList
          activeItem={idLocal}
          filterSettings={
            <AuthorsFilterSettings query={query} setQuery={setQuery} />
          }
          linkBase="author"
          heading={formatMessage({
            description: "Authors sidebar list item name",
            defaultMessage: "Authors",
          })}
          itemType={namespaces.core.author}
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        idLocal ? (
          <AuthorDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No author selected placeholder"
              defaultMessage="Please select an author"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
