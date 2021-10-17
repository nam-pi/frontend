import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { Field, Props as FieldProps } from "../Field";
import {
    LiteralRepeater,
    Props as LiteralRepeaterProps
} from "../LiteralRepeater";

interface Props
  extends Omit<FieldProps, "children" | "help" | "label">,
    Omit<LiteralRepeaterProps, "label"> {
  label?: ReactNode;
}

export const TextsField = ({ label, required, ...props }: Props) => {
  const intl = useIntl();
  return (
    <Field
      help={intl.formatMessage({
        description: "Texts field help",
        defaultMessage:
          "Enter as many text-language combinations as you like to use as texts for this entity.",
      })}
      label={intl.formatMessage({
        description: "Texts field label",
        defaultMessage: "Texts",
      })}
      required={required}
    >
      <LiteralRepeater
        label={
          label ||
          intl.formatMessage({
            description: "Default text input label",
            defaultMessage: "Text",
          })
        }
        {...props}
      />
    </Field>
  );
};
