import { Repeater } from "../Repeater";
import { Props as TypeInputProps, Type, TypeInput } from "../TypeInput";

interface Props extends Omit<TypeInputProps, "onChange" | "value"> {
  onChange: (value: Type[]) => void;
  values: undefined | Type[];
}

export const TypeRepeater = ({ onChange, values, ...inputProps }: Props) => (
  <Repeater<Type, TypeInputProps, typeof TypeInput>
    addComponent={TypeInput}
    onChange={onChange}
    outputComponent={({ value }) => <div>{value.text}</div>}
    props={inputProps}
    valid={(type) => {
      return (type?.value || "").replace(/\s/g, "").length > 0;
    }}
    values={values}
  />
);
