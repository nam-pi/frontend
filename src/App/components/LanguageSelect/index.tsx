import { useLanguages } from "App/hooks/useLanguages";
import Fuse from "fuse.js";
import { Language, TranslationState } from "I18n/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ComboBox, Option, Props as ComboBoxProps } from "../ComboBox";

interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  onChange: (value: undefined | string, text: string) => void;
  value?: string;
}

type Languages = TranslationState["languages"];

const findMatches = (
  text: string,
  options: Fuse<Option>,
  languages: Languages
) => (text ? options.search(text).map((r) => r.item) : languages);

const findText = (value: undefined | string, matches: Languages): string =>
  matches.find((match) => match.value === value)?.text || "";

const findValue = (text: string, matches: Languages) =>
  matches?.length > 0 && matches[0].text === text
    ? matches[0].value
    : undefined;

export const LanguageSelect = ({
  onChange = () => undefined,
  value,
  ...props
}: Props) => {
  const languages = useLanguages();
  const options = useMemo(
    () =>
      new Fuse<Language>(languages, {
        keys: ["text", "value"],
        threshold: 0.2,
      }),
    [languages]
  );
  const [text, setText] = useState<string>(findText(value, languages));
  const [matches, setMatches] = useState<Language[]>(
    findMatches(text, options, languages)
  );
  const lastText = useRef(text);
  const lastValue = useRef<undefined | string>(value);

  useEffect(() => {
    if (text === lastText.current && value !== lastValue.current) {
      const newText = findText(value, languages);
      const newMatches = findMatches(newText, options, languages);
      lastValue.current = value;
      lastText.current = newText;
      setText(newText);
      setMatches(newMatches);
    }
  }, [languages, matches, options, text, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newText = e.target.value;
      const newMatches = findMatches(newText, options, languages);
      const newValue = findValue(newText, newMatches);
      if (text !== newText) {
        lastValue.current = newValue;
        lastText.current = newText;
        onChange(newValue, newText);
        setText(newText);
        setMatches(newMatches);
      }
    },
    [languages, onChange, options, text]
  );

  return (
    <ComboBox
      {...props}
      matches={matches.map((m) => m.text)}
      onChange={handleChange}
      options={languages.map((m) => m.text)}
      value={text}
    />
  );
};
