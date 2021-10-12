import { useEffect, useState } from "react";
import {
    Individual,
    IndividualInput,
    Props as IndividualInputProps
} from "../IndividualInput";
import { Props as TypeInputProps, Type, TypeInput } from "../TypeInput";

export interface Props {
  individualType: IndividualInputProps["type"];
  onChange?: (value: Couple) => void;
  propertyType: TypeInputProps["parent"];
  value?: Couple;
}

export interface Couple {
  type: Type;
  individual: Individual;
}

export const CoupleInput = ({
  individualType,
  onChange = () => {},
  propertyType,
  value,
}: Props) => {
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
        parent={propertyType}
        onChange={(t) => {
          onChange({ individual, type: t });
          setType(t);
        }}
        value={type}
      />
      <IndividualInput
        className="mt-4"
        onChange={(i) => {
          onChange({ type, individual: i });
          setIndividual(i);
        }}
        type={individualType}
        value={individual}
      />
    </div>
  );
};
