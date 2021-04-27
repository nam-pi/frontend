import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface Props extends FontAwesomeIconProps {}

export const Icon = ({ className, ...props }: Props) => (
  <FontAwesomeIcon {...props} className={clsx("", className)} />
);
