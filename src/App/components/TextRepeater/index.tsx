import { Input, Props as InputProps } from "../Input";
import { Repeater } from "../Repeater";

interface WrapperProps extends Omit<InputProps, "onChange" | "value"> {
  onChange: (value: string) => void;
  value: undefined | string;
}

interface Props extends Omit<WrapperProps, "onChange" | "values" | "value"> {
  onChange: (value: string[]) => void;
  values: undefined | string[];
}

const WrappedInput = ({ onChange, ref, value, ...props }: WrapperProps) => (
  <Input
    {...props}
    onChange={(e) => onChange(e.target.value)}
    value={value || ""}
  />
);

export const TextRepeater = ({ onChange, values, ...inputProps }: Props) => (
  <Repeater<string, WrapperProps, typeof WrappedInput>
    addComponent={WrappedInput}
    onChange={onChange}
    outputComponent={({ value }) => <div>{value}</div>}
    props={inputProps as WrapperProps}
    valid={(text) => {
      return (text || "").replace(/\s/g, "").length > 0;
    }}
    values={values}
  />
);
