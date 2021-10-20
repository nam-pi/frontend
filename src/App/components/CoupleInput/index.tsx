import { ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
    Individual,
    IndividualInput,
    Props as IndividualInputProps
} from "../IndividualInput";
import { Props as TypeInputProps, Type, TypeInput } from "../TypeInput";

export interface Props {
  individualType: IndividualInputProps["type"];
  label?: ReactNode;
  onChange?: (value: Couple) => void;
  placeholder?: string;
  propertyType: TypeInputProps["parent"];
  value?: Couple;
}

export interface Couple {
  type: Type;
  individual: Individual;
}

export const CoupleInput = ({
  individualType,
  label,
  onChange = () => {},
  placeholder,
  propertyType,
  value,
}: Props) => {
  const intl = useIntl();
  const [type, setType] = useState<Type>(
    value?.type || { text: "", value: undefined }
  );
  const [individual, setIndividual] = useState<Individual>(
    value?.individual || { label: "", id: "" }
  );
  useEffect(() => {
    setType(value?.type || { text: "", value: undefined });
    setIndividual(value?.individual || { label: "", id: "" });
  }, [value?.individual, value?.type]);
  return (
    <div className="w-full">
      <TypeInput
        placeholder={intl.formatMessage({
          description: "Type input placeholder",
          defaultMessage: "Select a type",
        })}
        parent={propertyType}
        onChange={(t) => {
          onChange({ individual, type: t });
          setType(t);
        }}
        value={type}
      />
      <IndividualInput
        className="mt-2"
        label={label}
        onChange={(i) => {
          onChange({ type, individual: i });
          setIndividual(i);
        }}
        placeholder={placeholder}
        type={individualType}
        value={individual}
      />
    </div>
  );
};
