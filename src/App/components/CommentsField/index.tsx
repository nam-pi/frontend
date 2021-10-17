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

export const CommentsField = ({ label, required, ...props }: Props) => {
  const intl = useIntl();
  return (
    <Field
      help={intl.formatMessage({
        description: "Comments field help",
        defaultMessage:
          "Enter as many text-language combinations as you like to use as comments for this entity.",
      })}
      label={intl.formatMessage({
        description: "Comments field label",
        defaultMessage: "Comments",
      })}
      required={required}
    >
      <LiteralRepeater
        {...props}
        label={
          label ||
          intl.formatMessage({
            description: "Default comment input label",
            defaultMessage: "Comment",
          })
        }
        type="multiline"
      />
    </Field>
  );
};
