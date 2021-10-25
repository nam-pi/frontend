import { AuthorsQuery } from "nampi-use-api";
import { Dispatch, SetStateAction } from "react";
import { useIntl } from "react-intl";
import { Field } from "../Field";
import { FilterSettingsContainer } from "../FilterSettingsContainer";
import { Input } from "../Input";

interface Props {
  query: AuthorsQuery;
  setQuery: Dispatch<SetStateAction<AuthorsQuery>>;
}

export const AuthorsFilterSettings = ({ query, setQuery }: Props) => {
  const intl = useIntl();
  return (
    <FilterSettingsContainer>
      <Field
        label={intl.formatMessage({
          description: "Author text filter label",
          defaultMessage: "Author label",
        })}
        help={intl.formatMessage({
          description: "Author ext filter help",
          defaultMessage:
            "Enter any part of an author's label. You can use regular expressions like *H(ä|ae)ndel* to exactly specify what you are interested in.",
        })}
      >
        <Input
          autoFocus
          label={intl.formatMessage({
            description: "Author text input label",
            defaultMessage: "Text",
          })}
          placeholder={intl.formatMessage({
            description: "Author text filter input placeholder",
            defaultMessage: "Enter filter content",
          })}
          value={query.text}
          onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
        />
      </Field>
    </FilterSettingsContainer>
  );
};
