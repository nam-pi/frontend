import { namespaces } from "App/namespaces";
import { GroupsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction, useState } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";
import { Type, TypeInput } from "../TypeInput";

interface Props {
  query: GroupsQuery;
  setQuery: Dispatch<SetStateAction<GroupsQuery>>;
}

export const GroupsFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  const [form, setForm] = useState<{ type: Type }>({
    type: { text: "", value: query.type },
  });
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Group text filter label",
          defaultMessage: "Group label and text",
        })}
        help={intl.formatMessage({
          description: "Group text filter help",
          defaultMessage:
            "Enter any part of a group's label or text content. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Group text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Group text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
      <Field
        label={intl.formatMessage({
          description: "Group type filter label",
          defaultMessage: "Group type",
        })}
        help={intl.formatMessage({
          description: "Group type help text",
          defaultMessage: "Select the type of group you are interested in.",
        })}
      >
        <TypeInput
          onChange={(type) => {
            setQuery((q) => ({ ...q, type: type.value }));
            setForm((form) => ({ ...form, type }));
          }}
          parent={namespaces.core.group}
          placeholder={intl.formatMessage({
            description: "Group type input placeholder",
            defaultMessage: "Enter and select group type",
          })}
          value={form.type}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
