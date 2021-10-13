import { LiteralString } from "nampi-use-api";
import { LiteralInput, Props as LiteralInputProps } from "../LiteralInput";
import { MultiLangTexts } from "../MultiLangTexts";
import { Repeater } from "../Repeater";

interface Props
  extends Omit<LiteralInputProps, "onChange" | "values" | "value"> {
  onChange: (value: LiteralString[]) => void;
  values: undefined | LiteralString[];
}

export const LiteralRepeater = ({ onChange, values, ...inputProps }: Props) => (
  <Repeater<LiteralString, LiteralInputProps, typeof LiteralInput>
    addComponent={LiteralInput}
    onChange={onChange}
    outputComponent={({ value }) => <MultiLangTexts texts={value} />}
    props={inputProps}
    valid={(label) => {
      return (label?.value || "").replace(/\s/g, "").length > 0;
    }}
    values={values}
  />
);
