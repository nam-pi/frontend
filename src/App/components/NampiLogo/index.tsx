import { useIntl } from "react-intl";
import { Image } from "../Image";
import nampiLogo from "./nampi-logo.svg";

interface Props {
  className?: string;
}

export const NampiLogo = ({ className }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Image
      className={className}
      src={nampiLogo}
      alt={formatMessage({
        defaultMessage: "NAMPI logo",
        description: "The alt text for the NAMPI logo",
      })}
    />
  );
};
