import { useIntl } from "react-intl";
import { Field, Props as FieldProps } from "../Field";
import { Props as TypeRepeaterProps, TypeRepeater } from "../TypeRepeater";

interface Props
  extends Omit<FieldProps, "children" | "help" | "label" | "required">,
    Omit<TypeRepeaterProps, "label"> {}

export const TypesField = ({ required, ...props }: Props) => {
  const intl = useIntl();
  return (
    <Field
      help={intl.formatMessage({
        description: "Types field help",
        defaultMessage:
          "Enter all desired types for this entity from the database. You can only select available types for the current kind of entity.",
      })}
      label={intl.formatMessage({
        description: "Types field label",
        defaultMessage: "Types",
      })}
      required
    >
      <TypeRepeater
        placeholder={intl.formatMessage({
          description: "Type input placeholder",
          defaultMessage: "Enter and select a type",
        })}
        label={intl.formatMessage({
          description: "Type input label",
          defaultMessage: "Type",
        })}
        {...props}
      />
    </Field>
  );
};
