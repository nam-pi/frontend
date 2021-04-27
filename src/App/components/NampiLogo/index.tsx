import { Image } from "../Image";
import nampiLogo from "./nampi-logo.svg";

interface Props {
  className?: string;
}

export const NampiLogo = ({ className }: Props) => (
  <Image className={className} src={nampiLogo} alt="NAMPI logo" />
);
