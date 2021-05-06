import { Locale } from "./Locale";

export interface TranslationState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
