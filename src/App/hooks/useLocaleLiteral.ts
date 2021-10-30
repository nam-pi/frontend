import { LiteralString } from "nampi-use-api";
import { useCallback } from "react";
import { useIntl } from "react-intl";

export const useLocaleLiteral = (): ((
  literals: undefined | LiteralString | LiteralString[]
) => string) => {
  const { locale } = useIntl();
  return useCallback(
    (literals) => {
      if (!Array.isArray(literals)) {
        return literals?.value || "";
      }
      const exactMatch = literals.find(
        (literal) => literal.language === locale
      )?.value;
      if (exactMatch) {
        return exactMatch;
      }
      return (
        literals.find((literal) => literal.language === locale.split("-")[0])
          ?.value ||
        literals?.[0]?.value ||
        ""
      );
    },
    [locale]
  );
};
