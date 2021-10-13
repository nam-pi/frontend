import { Couple, CoupleInput, Props as CoupleInputProps } from "../CoupleInput";
import { Repeater } from "../Repeater";

interface Props extends Omit<CoupleInputProps, "onChange" | "value"> {
  onChange: (value: Couple[]) => void;
  values: undefined | Couple[];
}

export const CoupleRepeater = ({ onChange, values, ...inputProps }: Props) => (
  <Repeater<Couple, CoupleInputProps, typeof CoupleInput>
    addComponent={CoupleInput}
    onChange={onChange}
    outputComponent={({ value }) => (
      <div>{`${value.type.text} | ${value.individual.label}`}</div>
    )}
    props={inputProps}
    valid={(couple) => {
      return (
        (couple?.type.value || "").replace(/\s/g, "").length > 0 &&
        (couple?.individual.id || "").replace(/\s/g, "").length > 0
      );
    }}
    values={values}
  />
);
