import { useLanguages } from "App/hooks/useLanguages";
import Fuse from "fuse.js";
import { TranslationState } from "I18n/types";
import { useCallback, useEffect, useReducer } from "react";
import { ComboBox, Option, Props as ComboBoxProps } from "../ComboBox";

interface Props
  extends Omit<ComboBoxProps, "options" | "matches" | "value" | "onChange"> {
  onChange: (text: string, value?: string) => void;
  value?: string;
}

type Languages = TranslationState["languages"];

interface State {
  languages: Languages;
  matches: Option[];
  options: Fuse<Option>;
  text: string;
  value?: string;
}

type Action =
  | {
      type: "changeText";
      text: string;
    }
  | { type: "setLanguages"; languages: Languages };

const initialState: State = {
  languages: [],
  matches: [],
  options: new Fuse<Option>([]),
  text: "",
};

const findMatches = (
  text: string,
  options: Fuse<Option>,
  languages: Languages
) => (text ? options.search(text).map((r) => r.item) : languages);

const findValue = (text: string, matches: Languages) =>
  matches?.length > 0 && matches[0].text === text
    ? matches[0].value
    : undefined;

const findText = (value: string, matches: Languages): string =>
  matches.find((match) => match.value === value)?.text || "";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "changeText": {
      const matches = findMatches(action.text, state.options, state.languages);
      return {
        ...state,
        matches,
        text: action.text,
        value: findValue(action.text, matches),
      };
    }
    case "setLanguages": {
      const options = new Fuse<Option>(action.languages, {
        keys: ["text", "value"],
        threshold: 0.2,
      });
      const matches = findMatches(state.text, options, action.languages);
      return {
        ...state,
        languages: action.languages,
        matches,
        options,
        value: findValue(state.text, matches),
      };
    }
    default:
      return state;
  }
};

export const LanguageSelect = ({
  onChange = () => undefined,
  value: externalValue = "",
  ...props
}: Props) => {
  const languages = useLanguages();
  const [{ text, matches, value }, dispatch] = useReducer(reducer, {
    ...initialState,
    text: findText(externalValue, languages),
    value: externalValue,
  });
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "changeText", text: e.target.value });
  }, []);
  useEffect(() => {
    dispatch({ type: "setLanguages", languages });
  }, [languages]);
  useEffect(() => {
    onChange(text, value);
  }, [onChange, text, value]);
  return (
    <ComboBox
      {...props}
      matches={matches}
      onChange={handleChange}
      options={languages}
      value={text}
    />
  );
};
