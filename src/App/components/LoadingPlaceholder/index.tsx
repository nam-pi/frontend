import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

interface Props extends Omit<FontAwesomeIconProps, "spin" | "icon"> {
  icon?: IconProp;
}

export const LoadingPlaceholder = ({
  icon = faCircleNotch,
  ...props
}: Props) => <FontAwesomeIcon {...props} icon={icon} spin />;
