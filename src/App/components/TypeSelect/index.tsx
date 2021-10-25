import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import { useTypes } from "nampi-use-api";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { Option, Select } from "../Select";

export interface Props {
  className?: string;
  id?: string;
  label?: string;
  onChange?: (id: string, value: string) => void;
  typeBase: string;
  typeIri?: string;
}

type SelectOption = Option<string>;

export const TypeSelect = ({
  className,
  id,
  onChange = () => {},
  typeBase,
  typeIri,
}: Props) => {
  const intl = useIntl();
  const getText = useLocaleLiteral();
  const { formatMessage } = useIntl();
  const emptyType = useRef<SelectOption>({
    text: formatMessage({
      description: "All types selected message",
      defaultMessage: "All types",
    }),
    value: "",
  });

  const { data } = useTypes({
    query: {
      limit: 1000,
      orderBy: "label",
      type: typeBase,
    },
  });

  const allTypes = useMemo(() => {
    const results: SelectOption[] = [emptyType.current];
    if (data) {
      for (let i = 0, length = data.length; i < length; i++) {
        results.push({ value: data[i].id, text: getText(data[i].labels) });
      }
    }
    return results;
  }, [data, emptyType, getText]);

  return (
    <Select
      className={className}
      id={id}
      label={intl.formatMessage({
        description: "Type select label",
        defaultMessage: "Type",
      })}
      options={allTypes}
      selected={typeIri}
      onChange={(v) => onChange(v.value, v.text)}
    />
  );
};
