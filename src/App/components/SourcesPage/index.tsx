import { namespaces } from "App/namespaces";
import { SourcesQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { ItemTypeSelect } from "../ItemTypeSelect";
import { Label } from "../Label";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";
import { SourceDetails } from "../SourceDetails";

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
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label className="col-span-2" htmlFor="type-input">
                <FormattedMessage
                  description="Source type filter input label"
                  defaultMessage="Source type"
                />
              </Label>
              <ItemTypeSelect
                className="col-span-4"
                id="type-input"
                onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
                typeBase={namespaces.core.source}
                typeIri={query.type}
              />
              <Label className="col-span-2" htmlFor="text-input">
                <FormattedMessage
                  description="Source text filter input label"
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
          itemName={formatMessage({
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
