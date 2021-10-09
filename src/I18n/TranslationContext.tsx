import {
    createContext,
    ReactNode,
    useCallback,
    useMemo,
    useState
} from "react";
import { IntlProvider } from "react-intl";
import {
    DEFAULT_LOCALE,
    DEFAULT_TRANSLATION_STATE,
    LOG_MISSING_TRANSLATIONS,
    MESSAGES
} from "./constants";
import allLanguages from "./languages";

interface Props {
  children: ReactNode;
}

const TranslationContext = createContext(DEFAULT_TRANSLATION_STATE);

const TranslationProvider = ({ children }: Props) => {
  const [state, setState] = useState({
    locale: Object.keys(MESSAGES).includes(navigator.language)
      ? navigator.language
      : DEFAULT_LOCALE,
  });
  const languages = useMemo(() => allLanguages[state.locale], [state.locale]);
  const setLocale = useCallback((locale: string) => setState({ locale }), []);
  return (
    <TranslationContext.Provider
      value={{ locale: state.locale, setLocale, languages }}
    >
      <IntlProvider
        locale={state.locale}
        messages={
          MESSAGES[state.locale as keyof typeof MESSAGES] || MESSAGES["en-GB"]
        }
        onError={(e) => {
          if (LOG_MISSING_TRANSLATIONS) {
            console.warn(e.message);
          }
        }}
      >
        {children}
      </IntlProvider>
    </TranslationContext.Provider>
  );
};

export { TranslationProvider, TranslationContext };
