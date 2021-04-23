import deDEMessages from "I18n/translations/de-DE.json";
import enUSMessages from "I18n/translations/en-US.json";
import { Locale } from "./Locale";
import { TranslationState } from "./types";

export const DEFAULT_LOCALE = Locale.En;

export const DEFAULT_TRANSLATION_STATE: TranslationState = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
};

export const MESSAGES = {
  [Locale.De]: deDEMessages,
  [Locale.En]: enUSMessages,
};

export const LANGUAGE_NAMES = {
  [Locale.De]: "Deutsch",
  [Locale.En]: "English",
};
