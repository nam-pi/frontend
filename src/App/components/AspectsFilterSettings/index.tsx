import { namespaces } from "App/namespaces";
import { AspectsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: AspectsQuery;
  setQuery: Dispatch<SetStateAction<AspectsQuery>>;
}

export const AspectsFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<{ type: Type }>({
    type: { text: "", value: query.type },
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Aspect text filter label",
          defaultMessage: "Aspect label and text",
        })}
        help={intl.formatMessage({
          description: "Aspect text filter help",
          defaultMessage:
            "Enter any part of an aspect's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Aspect text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Aspect text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Aspect type filter label",
          defaultMessage: "Aspect type",
        })}
        help={intl.formatMessage({
          description: "Aspect type help text",
          defaultMessage: "Select the type of aspect you are interested in.",
        })}
      >
        <TypeInput
          onChange={(type) => {
            setQuery((q) => ({ ...q, type: type.value }));
            setForm((form) => ({ ...form, type }));
          }}
          parent={namespaces.core.aspect}
          placeholder={intl.formatMessage({
            description: "Aspect type input placeholder",
            defaultMessage: "Enter and select aspect type",
          })}
          value={form.type}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
