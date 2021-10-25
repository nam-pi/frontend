import { APP_LOGO } from "App/constants";
import { useIntl } from "react-intl";
import { Image } from "../Image";

interface Props {
  className?: string;
}

export const AppLogo = ({ className }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Image
      className={className}
      src={APP_LOGO}
      alt={formatMessage({
        defaultMessage: "NAMPI logo",
        description: "The alt text for the NAMPI logo",
      })}
    />
  );
};
