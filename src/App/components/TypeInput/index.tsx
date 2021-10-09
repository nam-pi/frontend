import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocaleLiteral } from "App/hooks/useLocaleLiteral";
import Fuse from "fuse.js";
import { useTypes } from "nampi-use-api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { ComboBox, Props as ComboBoxProps } from "../ComboBox";

interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  parent: string;
  onChange: (value: undefined | string, text: string) => void;
  value?: string;
}

interface Type {
  text: string;
  value: undefined | string;
}

type Types = Type[];

const findMatches = (text: string, options: Fuse<Type>, languages: Types) =>
  text ? options.search(text).map((r) => r.item) : languages;

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
  const { data, loading, initialized } = useTypes({ query: { type: parent } });
  const oldData = useRef<typeof data>(data);
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
  const options = useMemo(
    () =>
      new Fuse<Type>(types, {
        keys: ["text", "value"],
        threshold: 0.2,
      }),
    [types]
  );
  const [text, setText] = useState<string>(findText(value, types));
  const [matches, setMatches] = useState<Type[]>(
    findMatches(text, options, types)
  );
  const lastText = useRef(text);
  const lastValue = useRef<undefined | string>(value);

  useEffect(() => {
    if (oldData.current !== data) {
      oldData.current = data;
      const newMatches = findMatches(text, options, types);
      setMatches(newMatches);
      if (newMatches.length > 0) {
        setText(newMatches[0].text);
      }
    }
  }, [data, options, text, types]);

  useEffect(() => {
    if (text === lastText.current && value !== lastValue.current) {
      const newText = findText(value, types);
      const newMatches = findMatches(newText, options, types);
      lastValue.current = value;
      lastText.current = newText;
      setText(newText);
      setMatches(newMatches);
    }
  }, [types, matches, options, text, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      const newMatches = findMatches(newText, options, types);
      const newValue = findValue(newText, newMatches);
      if (text !== newText) {
        lastValue.current = newValue;
        lastText.current = newText;
        onChange(newValue, newText);
        setText(newText);
        setMatches(newMatches);
      }
    },
    [types, onChange, options, text]
  );

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
