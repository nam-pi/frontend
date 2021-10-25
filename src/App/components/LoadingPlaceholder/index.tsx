import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import {
    FontAwesomeIcon,
    FontAwesomeIconProps
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface Props extends Omit<FontAwesomeIconProps, "spin" | "icon"> {
  maximized?: boolean;
  icon?: IconProp;
  delay?: boolean | number;
}

const DEFAULT_DELAY = 500;

export const LoadingPlaceholder = ({
  className,
  delay,
  icon = faCircleNotch,
  maximized = false,
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
  return visible ? (
    <div
      className={clsx(
        "w-full flex justify-center items-center",
        maximized ? "h-screen" : "h-full"
      )}
    >
      <FontAwesomeIcon
        {...props}
        className={clsx(
          className,
          "text-3xl",
          !className?.includes("text-") && "text-gray-400"
        )}
        icon={icon}
        spin
      />
    </div>
  ) : (
    <></>
  );
};
