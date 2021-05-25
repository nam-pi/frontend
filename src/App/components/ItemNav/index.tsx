import {
  faBackward,
  faForward,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { CollectionNav } from "nampi-use-api";
import { IconButton } from "../IconButton";

export const ItemNav = ({
  className,
  disabled,
  nav,
  page,
}: {
  className?: string;
  disabled: boolean;
  nav: undefined | CollectionNav;
  page: undefined | number;
}) => (
  <div className={clsx("space-x-2 text-xs", className)}>
    <IconButton
      disabled={disabled || !nav?.first}
      onClick={nav?.first}
      icon={faStepBackward}
    />
    <IconButton
      disabled={disabled || !nav?.previous}
      onClick={nav?.previous}
      icon={faBackward}
    />
    <span className="w-3 inline-block text-center">{page || ""}</span>
    <IconButton
      disabled={disabled || !nav?.next}
      onClick={nav?.next}
      icon={faForward}
    />
    <IconButton
      disabled={disabled || !nav?.last}
      onClick={nav?.last}
      icon={faStepForward}
    />
  </div>
);
