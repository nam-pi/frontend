import clsx from "clsx";
import { LiteralString } from "nampi-use-api";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Input } from "../Input";
import { LanguageSelect } from "../LanguageSelect";
import { Textarea } from "../Textarea";

interface Props {
  className?: string;
  onChange: (value: LiteralString) => void;
  label?: string;
  type?: "single" | "multiline";
  value?: LiteralString;
}

interface State {
  text: string;
  language: undefined | string;
}

export const LiteralInput = ({
  className,
  onChange = () => undefined,
  label,
  type = "single",
  value,
}: Props) => {
  const intl = useIntl();
  const [state, setState] = useState<State>({
    text: value?.value || "",
    language: value?.language,
  });
  useEffect(() => {
    if (value?.value !== state.text || value?.language !== state.language) {
      onChange({ value: state.text, language: state.language });
    }
  }, [onChange, state.language, state.text, value?.language, value?.value]);
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setState((old) => ({ ...old, text: e.target.value })),
    []
  );
  const handleLanguageChange = useCallback(
    (_: string, lang: undefined | string) =>
      setState((old) => ({ ...old, language: lang })),
    []
  );

  return (
    <div className={clsx(className, "w-full grid grid-cols-6 gap-4")}>
      {type === "single" ? (
        <Input
          className="col-span-6 md:col-span-3"
          label={label}
          onChange={handleTextChange}
          value={state.text}
        />
      ) : (
        <Textarea
          className="col-span-6"
          label={label}
          onChange={handleTextChange}
          value={state.text}
        />
      )}
      <LanguageSelect
        className="col-span-6 md:col-span-3"
        onChange={handleLanguageChange}
        label={intl.formatMessage({
          description: "Langue input label",
          defaultMessage: "Language",
        })}
        value={state.language}
      />
    </div>
  );
};
