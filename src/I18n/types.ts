export interface TranslationState {
  locale: string;
  setLocale: (locale: string) => void;
  languages: { text: string; value: string }[];
}
