import { namespaces } from "App/namespaces";
import { PersonsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: PersonsQuery;
  setQuery: Dispatch<SetStateAction<PersonsQuery>>;
}

export const PersonsFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<{ type: Type }>({
    type: { text: "", value: query.type },
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Person text filter label",
          defaultMessage: "Person label and text",
        })}
        help={intl.formatMessage({
          description: "Person text filter help",
          defaultMessage:
            "Enter any part of a person's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Person text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Person text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Person type filter label",
          defaultMessage: "Person type",
        })}
        help={intl.formatMessage({
          description: "Person type help text",
          defaultMessage: "Select the type of person you are interested in.",
        })}
      >
        <TypeInput
          onChange={(type) => {
            setQuery((q) => ({ ...q, type: type.value }));
            setForm((form) => ({ ...form, type }));
          }}
          parent={namespaces.core.person}
          placeholder={intl.formatMessage({
            description: "Person type input placeholder",
            defaultMessage: "Enter and select person type",
          })}
          value={form.type}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
