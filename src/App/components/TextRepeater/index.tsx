import { Input, Props as InputProps } from "../Input";
import { Repeater } from "../Repeater";

interface Text {
  text: string;
}

interface WrapperProps extends Omit<InputProps, "onChange" | "value"> {
  onChange: (value: Text) => void;
  value?: Text;
}

interface Props extends Omit<WrapperProps, "onChange" | "values"> {
  onChange: (value: string[]) => void;
  values: undefined | string[];
}

const WrappedInput = ({ onChange, ref, value, ...props }: WrapperProps) => (
  <Input
    {...props}
    onChange={(e) => onChange({ text: e.target.value })}
    value={value?.text || ""}
  />
);

export const TextRepeater = ({ onChange, values, ...inputProps }: Props) => (
  <Repeater<Text, WrapperProps, typeof WrappedInput>
    addComponent={WrappedInput}
    onChange={(texts) => onChange(texts.map((text) => text.text))}
    outputComponent={(text) => <div>{text.text}</div>}
    props={inputProps}
    valid={(text) => {
      return (text?.text || "").replace(/\s/g, "").length > 0;
    }}
    values={values?.map((text) => ({ text }))}
  />
);
