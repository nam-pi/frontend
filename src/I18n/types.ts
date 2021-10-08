export interface Language {
  text: string;
  value: string;
}

export interface TranslationState {
  locale: string;
  setLocale: (locale: string) => void;
  languages: Language[];
}
