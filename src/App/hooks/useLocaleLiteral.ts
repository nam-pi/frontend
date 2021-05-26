import { LiteralString } from "nampi-use-api";
import { useIntl } from "react-intl";

export const useLocaleLiteral = (): (literals: undefined | LiteralString | LiteralString[]) => string => {
  const { locale } = useIntl();
  return (literals) => {
    if (!Array.isArray(literals)) {
      return literals?.value || "";
    }
    return literals.find(literal => literal.language === locale)?.value || literals?.[0].value || ""
  }
}