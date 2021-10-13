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
import { useIntl } from "react-intl";
import { ComboBox, Props as ComboBoxProps } from "../ComboBox";

export interface Individual {
  label: string;
  id?: undefined | string;
}

export interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  type:
    | "actors"
    | "aspects"
    | "authors"
    | "groups"
    | "persons"
    | "places"
    | "sources";
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
  const individual = useIndividual();
  const conf = (active: Props["type"]) => ({
    query: { text: label, orderBy: "label" },
    paused:
      (active !== type && type !== "actors") ||
      (type === "actors" && active !== "groups" && active !== "persons") ||
      (label?.length || 0) === 0 ||
      id !== undefined,
  });
  const aspect = useAspects(conf("aspects"))?.data?.map(individual);
  const authors = useAuthors(conf("authors"))?.data?.map(individual);
  const group = useGroups(conf("groups"))?.data?.map(individual);
  const person = usePersons(conf("persons"))?.data?.map(individual);
  const place = usePlaces(conf("places"))?.data?.map(individual);
  const source = useSources(conf("sources"))?.data?.map(individual);
  switch (type) {
    case "actors":
      return [...(person || []), ...(group || [])];
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
  label: inputLabel,
  onChange = () => {},
  value,
  type,
  ...comboBoxProps
}: Props) => {
  const intl = useIntl();
  const [label, setLabel] = useState(value?.label);
  const [id, setId] = useState(value?.id);
  const individuals = useQuery(type, label, id);
  const options = useMemo(
    () =>
      label && individuals
        ? individuals.sort((a, b) => a!.label.localeCompare(b!.label))
        : [],
    [individuals, label]
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
      label={
        inputLabel ||
        intl.formatMessage({
          description: "Default input label",
          defaultMessage: "Label",
        })
      }
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
