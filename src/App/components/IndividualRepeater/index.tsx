import {
    Individual,
    IndividualInput, Props as IndividualInputProps
} from "../IndividualInput";
import { Repeater } from "../Repeater";

interface Props extends Omit<IndividualInputProps, "onChange" | "value"> {
  onChange: (value: Individual[]) => void;
  values: undefined | Individual[];
}

export const IndividualRepeater = ({
  onChange,
  values,
  ...inputProps
}: Props) => (
  <Repeater<Individual, IndividualInputProps, typeof IndividualInput>
    addComponent={IndividualInput}
    onChange={onChange}
    outputComponent={({ value }) => <div>{value.label}</div>}
    props={inputProps}
    valid={(individual) => {
      return (individual?.id || "").replace(/\s/g, "").length > 0;
    }}
    values={values}
  />
);
