import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

interface Props extends Omit<FontAwesomeIconProps, "spin" | "icon"> {
  icon?: IconProp;
  delay?: boolean | number;
}

const DEFAULT_DELAY = 500;

export const LoadingPlaceholder = ({
  delay,
  icon = faCircleNotch,
  ...props
}: Props) => {
  const timeout = useRef<undefined | NodeJS.Timeout>();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!delay) {
      setVisible(true);
    } else {
      timeout.current = setTimeout(
        () => setVisible(true),
        delay === true ? DEFAULT_DELAY : delay
      );
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [delay]);
  return visible ? <FontAwesomeIcon {...props} icon={icon} spin /> : <></>;
};
