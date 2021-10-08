import { LiteralString } from "nampi-use-api";
import { LiteralInput, Props as LiteralInputProps } from "../LiteralInput";
import { MultiLangTexts } from "../MultiLangTexts";
import { Repeater } from "../Repeater";

interface Props {
  label: string;
  onChange: (value: LiteralString[]) => void;
  values: undefined | LiteralString[];
}

export const LiteralRepeater = ({ label, onChange, values }: Props) => (
  <Repeater<LiteralString, LiteralInputProps, typeof LiteralInput>
    addComponent={LiteralInput}
    onChange={onChange}
    outputComponent={(label) => <MultiLangTexts texts={label} />}
    props={{ label }}
    valid={(label) => {
      return (
        (label?.value || "").replace(/\s/g, "").length > 0 &&
        label?.language !== undefined &&
        label.language.length > 0
      );
    }}
    values={values}
  />
);
