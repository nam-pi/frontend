import { namespaces } from "App/namespaces";
import { PlacesQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: PlacesQuery;
  setQuery: Dispatch<SetStateAction<PlacesQuery>>;
}

export const PlacesFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<{ type: Type }>({
    type: { text: "", value: query.type },
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Place text filter label",
          defaultMessage: "Place label and text",
        })}
        help={intl.formatMessage({
          description: "Place text filter help",
          defaultMessage:
            "Enter any part of a place's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Place text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Place text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Place type filter label",
          defaultMessage: "Place type",
        })}
        help={intl.formatMessage({
          description: "Place type help text",
          defaultMessage: "Select the type of place you are interested in.",
        })}
      >
        <TypeInput
          onChange={(type) => {
            setQuery((q) => ({ ...q, type: type.value }));
            setForm((form) => ({ ...form, type }));
          }}
          parent={namespaces.core.place}
          placeholder={intl.formatMessage({
            description: "Place type input placeholder",
            defaultMessage: "Enter and select place type",
          })}
          value={form.type}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
