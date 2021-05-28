import { namespaces } from "App/namespaces";
import { AuthorsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { AuthorDetails } from "../AuthorDetails";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { Label } from "../Label";
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
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="text-input"
              >
                <FormattedMessage
                  description="Author text filter input label"
                  defaultMessage="Text"
                />
              </Label>
              <Input
                className="col-span-4"
                id="text-input"
                value={query.text}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, text: e.target.value }))
                }
              />
            </div>
          }
          linkBase="author"
          itemName={formatMessage({
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
