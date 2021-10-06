import enGBMessages from "I18n/translations/en-GB.json";
import { TranslationState } from "./types";

export const DEFAULT_LOCALE = "en-GB";

export const DEFAULT_TRANSLATION_STATE: TranslationState = {
  languages: [],
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
};

export const MESSAGES = {
  "en-GB": enGBMessages,
};

export const LOG_MISSING_TRANSLATIONS =
  process.env.REACT_APP_LOG_MISSING_TRANSLATIONS || false;
