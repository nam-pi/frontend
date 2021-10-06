import { TranslationContext } from "I18n/TranslationContext";
import { useContext } from "react";

export const useLanguages = () => useContext(TranslationContext).languages;
