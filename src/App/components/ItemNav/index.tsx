import {
  faBackward,
  faForward,
  faStepBackward,
  faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { PartialNavigation } from "App/types";
import { IconButton } from "../IconButton";

export const ItemNav = ({
  disabled,
  nav,
}: {
  disabled: boolean;
  nav: PartialNavigation;
}) => (
  <div className="space-x-2 text-blue-500 text-xs">
    <IconButton
      disabled={disabled || !nav.first}
      onClick={nav.first}
      icon={faStepBackward}
    />
    <IconButton
      disabled={disabled || !nav.previous}
      onClick={nav.previous}
      icon={faBackward}
    />
    <IconButton
      disabled={disabled || !nav.next}
      onClick={nav.next}
      icon={faForward}
    />
    <IconButton
      disabled={disabled || !nav.last}
      onClick={nav.last}
      icon={faStepForward}
    />
  </div>
);
