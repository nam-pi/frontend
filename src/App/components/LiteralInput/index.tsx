import clsx from "clsx";
import { LiteralString } from "nampi-use-api";
import React, {
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { useIntl } from "react-intl";
import { Input } from "../Input";
import { LanguageInput } from "../LanguageInput";
import { Textarea } from "../Textarea";

export interface Props {
  className?: string;
  onChange?: (value: LiteralString) => void;
  label?: ReactNode;
  type?: "single" | "multiline";
  value?: LiteralString;
}

export const LiteralInput = ({
  className,
  onChange = () => {},
  label,
  type = "single",
  value,
}: Props) => {
  const intl = useIntl();
  const [text, setText] = useState<undefined | string>(value?.value);
  const [language, setLanguage] = useState<undefined | string>();

  const oldText = useRef<typeof text>(text);
  const oldLanguage = useRef<typeof language>(language);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newText = e.target.value;
      oldText.current = newText;
      onChange({ value: (newText || "").trim(), language: language });
      setText(newText);
    },
    [language, onChange]
  );
  const handleLanguageChange = useCallback(
    (lang: undefined | string) => {
      oldLanguage.current = lang;
      onChange({ value: (text || "").trim(), language: lang });
      setLanguage(lang);
    },
    [onChange, text]
  );
  useEffect(() => {
    if (!value && oldText.current && !oldLanguage.current) {
      oldText.current = undefined;
      oldLanguage.current = undefined;
      setText(undefined);
      setLanguage(undefined);
    } else if (
      value?.value !== oldText.current &&
      value?.language !== oldLanguage.current
    ) {
      oldText.current = value?.value;
      oldLanguage.current = value?.language;
      setText(value?.value || "");
      setLanguage(value?.language);
    }
  }, [onChange, value]);
  return (
    <div className={clsx(className, "w-full")}>
      {type === "single" ? (
        <Input
          label={label}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({
            description: "Literal input placeholder",
            defaultMessage: "Enter some text",
          })}
          value={text || ""}
        />
      ) : (
        <Textarea
          label={label}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({
            description: "Literal input placeholder",
            defaultMessage: "Enter some text",
          })}
          rows={2}
          value={text || ""}
        />
      )}
      <LanguageInput
        className="mt-2"
        onChange={handleLanguageChange}
        label={intl.formatMessage({
          description: "Langue input label",
          defaultMessage: "Language",
        })}
        value={language}
      />
    </div>
  );
};
