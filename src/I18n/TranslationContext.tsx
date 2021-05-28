import { createContext, ReactNode, useCallback, useState } from "react";
import { IntlProvider } from "react-intl";
import {
  DEFAULT_TRANSLATION_STATE,
  LOG_MISSING_TRANSLATIONS,
  MESSAGES,
} from "./constants";

interface Props {
  children: ReactNode;
}

const TranslationContext = createContext(DEFAULT_TRANSLATION_STATE);

const TranslationProvider = ({ children }: Props) => {
  const [state, setState] = useState({
    locale: navigator.language,
  });
  const setLocale = useCallback((locale: string) => setState({ locale }), []);
  return (
    <TranslationContext.Provider value={{ locale: state.locale, setLocale }}>
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
