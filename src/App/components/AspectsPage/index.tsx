import { namespaces } from "App/namespaces";
import { Aspect, AspectsQuery } from "nampi-use-api";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { AspectDetails } from "../AspectDetails";
import { FilterableItemList } from "../FilterableItemList";
import { Input } from "../Input";
import { Label } from "../Label";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";
import { TypeSelect } from "../TypeSelect";

interface Params {
  idLocal: string;
}

export const AspectsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
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
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="type-input"
              >
                <FormattedMessage
                  description="Aspect type filter input label"
                  defaultMessage="Aspect type"
                />
              </Label>
              <TypeSelect
                className="col-span-4"
                id="type-input"
                onChange={(id) => setQuery((q) => ({ ...q, type: id }))}
                typeBase={namespaces.core.aspect}
                typeIri={query.type}
              />
              <Label
                className="col-span-2 sm:flex sm:items-center"
                htmlFor="text-input"
              >
                <FormattedMessage
                  description="Aspect text filter input label"
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
            description: "Aspects sidebar list item name",
            defaultMessage: "Aspects",
          })}
          itemType={namespaces.core.aspect}
          linkBase="aspect"
          query={query}
          resetQuery={setQuery}
        />
      }
      main={
        idLocal ? (
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
