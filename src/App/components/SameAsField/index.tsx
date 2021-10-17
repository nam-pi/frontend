import { useIntl } from "react-intl";
import { Field, Props as FieldProps } from "../Field";
import { Props as TextRepeaterProps, TextRepeater } from "../TextRepeater";

interface Props
  extends Omit<FieldProps, "children" | "help" | "label">,
    Omit<TextRepeaterProps, "label"> {}

export const SameAsField = ({ required, ...props }: Props) => {
  const intl = useIntl();
  return (
    <Field
      help={intl.formatMessage({
        description: "SameAs field help",
        defaultMessage:
          "Enter as many links to this entity in other databases, for instance WikiData or Geonames, as you like. Please make sure that you enter **full URLs** including *http(s)://* that lead to the actual entity in the other database. For example, for a Geonames place this is *https://sws.geonames.org/11281591*.",
      })}
      label={intl.formatMessage({
        description: "SameAs field label",
        defaultMessage: "Links to other databases",
      })}
      required={required}
    >
      <TextRepeater
        placeholder={intl.formatMessage({
          description: "SameAs input placeholder",
          defaultMessage: "Enter a full URL including http(s)://",
        })}
        label={intl.formatMessage({
          description: "SameAs input label",
          defaultMessage: "URL",
        })}
        {...props}
      />
    </Field>
  );
};
