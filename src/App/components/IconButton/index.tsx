import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { Button, Props as ButtonProps } from "../Button";
type IconProps = Omit<FontAwesomeIconProps, keyof ButtonProps | "fixedWidth">;
type UnifiedProps = ButtonProps & IconProps;

interface Props extends Omit<UnifiedProps, "children"> {}

type FaKeys = Array<keyof IconProps>;

const iconKeys: FaKeys = [
  "icon",
  "mask",
  "spin",
  "pulse",
  "border",
  "inverse",
  "listItem",
  "flip",
  "size",
  "pull",
  "rotation",
  "transform",
  "symbol",
  "swapOpacity",
];

const separate = (
  props: Props
): [buttonProps: ButtonProps, iconProps: IconProps] => {
  const buttonProps = {} as ButtonProps;
  const iconProps = {} as IconProps;
  const keys = Object.keys(props);
  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i];
    if (iconKeys.includes(key as any)) {
      (iconProps as any)[key] = (props as any)[key];
    } else {
      (buttonProps as any)[key] = (props as any)[key];
    }
  }
  return [buttonProps, iconProps];
};

export const IconButton = (props: Props) => {
  const [buttonProps, iconProps] = separate(props);
  return (
    <Button {...buttonProps} className={clsx("px-1", buttonProps.className)}>
      <FontAwesomeIcon {...iconProps} fixedWidth />
    </Button>
  );
};
