import { useIntl } from "react-intl";
import { Field, Props as FieldProps } from "../Field";
import {
    LiteralRepeater,
    Props as LiteralRepeaterProps
} from "../LiteralRepeater";

interface Props
  extends Omit<FieldProps, "children" | "help" | "label">,
    Omit<LiteralRepeaterProps, "label"> {}

export const LabelsField = ({ required, ...props }: Props) => {
  const intl = useIntl();
  return (
    <Field
      help={intl.formatMessage({
        description: "Labels field label",
        defaultMessage:
          "Enter as many text-language combinations as you like to use as labels for this entity. This can be its name or any other customary label. It is intended to be understood by people and doesn't have a direct quote or official name.",
      })}
      label={intl.formatMessage({
        description: "Labels field label",
        defaultMessage: "Labels",
      })}
      required={required}
    >
      <LiteralRepeater
        label={intl.formatMessage({
          description: "Label input label",
          defaultMessage: "Label",
        })}
        {...props}
      />
    </Field>
  );
};
