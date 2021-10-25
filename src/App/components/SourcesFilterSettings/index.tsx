import { namespaces } from "App/namespaces";
import { SourcesQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: SourcesQuery;
  setQuery: Dispatch<SetStateAction<SourcesQuery>>;
}

export const SourcesFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<{ type: Type }>({
    type: { text: "", value: query.type },
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Source text filter label",
          defaultMessage: "Source label and text",
        })}
        help={intl.formatMessage({
          description: "Source text filter help",
          defaultMessage:
            "Enter any part of a source's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Source text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Source text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Source type filter label",
          defaultMessage: "Source type",
        })}
        help={intl.formatMessage({
          description: "Source type help text",
          defaultMessage: "Select the type of source you are interested in.",
        })}
      >
        <TypeInput
          onChange={(type) => {
            setQuery((q) => ({ ...q, type: type.value }));
            setForm((form) => ({ ...form, type }));
          }}
          parent={namespaces.core.source}
          placeholder={intl.formatMessage({
            description: "Source type input placeholder",
            defaultMessage: "Enter and select source type",
          })}
          value={form.type}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
