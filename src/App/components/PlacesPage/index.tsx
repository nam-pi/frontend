import { namespaces } from "App/namespaces";
import { PlacesQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { Label } from "../Label";
import { PlaceDetails } from "../PlaceDetails";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";
import { TypeSelect } from "../TypeSelect";

interface Params {
  idLocal: string;
}

export const PlacesPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const [query, setQuery] = useState<PlacesQuery>({
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
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="type-input"
              >
                <FormattedMessage
                  description="Place type filter input label"
                  defaultMessage="Place type"
                />
              </Label>
              <TypeSelect
                className="col-span-4"
                id="type-input"
                onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
                typeBase={namespaces.core.place}
                typeIri={query.type}
              />
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="text-input"
              >
                <FormattedMessage
                  description="Place text filter input label"
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
          heading={formatMessage({
            description: "Places sidebar list item name",
            defaultMessage: "Places",
          })}
          itemType={namespaces.core.place}
          linkBase="place"
          query={query}
          resetQuery={setQuery}
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
