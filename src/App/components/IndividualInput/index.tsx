import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import {
    Item,
    useAspects,
    useAuthors,
    useGroups,
    usePersons,
    usePlaces,
    useSources
} from "nampi-use-api";
import { useEffect, useMemo, useState } from "react";
import { ComboBox, Props as ComboBoxProps } from "../ComboBox";

export interface Individual {
  label: string;
  id?: undefined | string;
}

export interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  type: "aspects" | "authors" | "groups" | "persons" | "places" | "sources";
  onChange?: (individual: Individual) => void;
  value?: Individual;
}

export const useIndividual = () => {
  const literal = useLocaleLiteral();
  return (item: undefined | Item): undefined | Individual =>
    item && {
      id: item.id,
      label: literal(item.labels),
    };
};

const useQuery = (
  type: Props["type"],
  label: undefined | string,
  id: undefined | string
) => {
  const conf = (active: Props["type"]) => ({
    query: { text: label, orderBy: "label" },
    paused: active !== type || (label?.length || 0) === 0 || id !== undefined,
  });
  const aspect = useAspects(conf("aspects"));
  const authors = useAuthors(conf("authors"));
  const group = useGroups(conf("groups"));
  const person = usePersons(conf("persons"));
  const place = usePlaces(conf("places"));
  const source = useSources(conf("sources"));
  switch (type) {
    case "aspects":
      return aspect;
    case "authors":
      return authors;
    case "groups":
      return group;
    case "persons":
      return person;
    case "places":
      return place;
    case "sources":
      return source;
  }
};
export const IndividualInput = ({
  onChange = () => {},
  value,
  type,
  ...comboBoxProps
}: Props) => {
  const individual = useIndividual();
  const [label, setLabel] = useState(value?.label);
  const [id, setId] = useState(value?.id);
  const { data } = useQuery(type, label, id);
  const options = useMemo(
    () =>
      label
        ? (data || [])
            .map(individual)
            .sort((a, b) => a!.label.localeCompare(b!.label))
        : [],
    [data, individual, label]
  );
  const matches = useMemo(
    () => options.map((option) => option?.label || ""),
    [options]
  );
  useEffect(() => {
    setLabel(value?.label);
    setId(value?.id);
  }, [value?.id, value?.label]);
  return (
    <ComboBox
      {...comboBoxProps}
      matches={matches}
      onChange={(e) => {
        const newLabel = e.target.value;
        onChange(
          options.find((o) => o?.label === newLabel) || { label: newLabel }
        );
        setLabel(newLabel);
        setId(undefined);
      }}
      value={label || ""}
    />
  );
};
