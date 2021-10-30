import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import Fuse from "fuse.js";
import { useTypes } from "nampi-use-api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { ComboBox, Props as ComboBoxProps } from "../ComboBox";

export interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  parent: string;
  onChange?: (type: Type) => void;
  value?: Type;
}

export interface Type {
  text: string;
  value: undefined | string;
}

type Types = Type[];

const findMatches = (text: string, options: Fuse<Type>, types: Types) =>
  text ? options.search(text).map((r) => r.item) : types;

const findText = (value: undefined | string, matches: Types): string =>
  matches.find((match) => match.value === value)?.text || "";

const findValue = (text: string, matches: Types) =>
  matches?.length > 0 && matches[0].text === text
    ? matches[0].value
    : undefined;

export const TypeInput = ({
  label,
  parent,
  onChange = () => undefined,
  value,
  ...props
}: Props) => {
  const intl = useIntl();
  const literal = useLocaleLiteral();
  const { data, loading, initialized } = useTypes({
    query: { limit: 10000, type: parent },
  });
  const types = useMemo<Types>(
    () =>
      (data || [])
        .map((type) => ({
          text: literal(type.labels),
          value: type.id,
        }))
        .sort((a, b) => a.text.localeCompare(b.text)),
    [data, literal]
  );
  const oldTypes = useRef<typeof types>(types);
  const options = useMemo(
    () =>
      new Fuse<Type>(types, {
        keys: ["text", "value"],
        threshold: 0.2,
      }),
    [types]
  );
  const [text, setText] = useState<string>(findText(value?.value, types));
  const [matches, setMatches] = useState<Type[]>(
    findMatches(text, options, types)
  );
  const lastText = useRef(text);
  const lastValue = useRef<undefined | string>(value?.value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      const newMatches = findMatches(newText, options, types);
      const newValue = findValue(newText, newMatches);
      if (text !== newText) {
        lastValue.current = newValue;
        lastText.current = newText;
        onChange({ value: newValue, text: newText });
        setText(newText);
        setMatches(newMatches);
      }
    },
    [types, onChange, options, text]
  );

  useEffect(() => {
    if (oldTypes.current !== types) {
      oldTypes.current = types;
      const newMatches = findMatches(text, options, types);
      setMatches(newMatches);
    }
  }, [data, options, text, types]);

  useEffect(() => {
    if (value !== lastValue.current) {
      const newText = findText(value?.value, types) || text;
      const newMatches = findMatches(newText, options, types);
      lastValue.current = value?.value;
      lastText.current = newText;
      setText(newText);
      setMatches(newMatches);
    }
  }, [options, text, types, value]);

  return (
    <ComboBox
      {...props}
      label={
        loading || !initialized ? (
          <FontAwesomeIcon icon={faCircleNotch} spin />
        ) : (
          label ||
          intl.formatMessage({
            description: "Type input label",
            defaultMessage: "Type",
          })
        )
      }
      matches={matches.map((m) => m.text)}
      onChange={handleChange}
      options={types.map((m) => m.text)}
      value={text}
    />
  );
};
