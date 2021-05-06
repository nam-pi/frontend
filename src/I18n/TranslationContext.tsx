import { createContext, ReactNode, useCallback, useState } from "react";
import { IntlProvider } from "react-intl";
import {
  DEFAULT_LOCALE,
  DEFAULT_TRANSLATION_STATE,
  MESSAGES,
} from "./constants";
import { Locale } from "./Locale";

interface Props {
  children: ReactNode;
}

const TranslationContext = createContext(DEFAULT_TRANSLATION_STATE);

const TranslationProvider = ({ children }: Props) => {
  const [state, setState] = useState({
    locale: DEFAULT_LOCALE,
  });
  const setLocale = useCallback((locale: Locale) => setState({ locale }), []);
  return (
    <TranslationContext.Provider value={{ locale: state.locale, setLocale }}>
      <IntlProvider locale={state.locale} messages={MESSAGES[state.locale]}>
        {children}
      </IntlProvider>
    </TranslationContext.Provider>
  );
};

export { TranslationProvider, TranslationContext };
