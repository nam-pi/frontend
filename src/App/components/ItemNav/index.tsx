import {
    faBackward,
    faForward,
    faStepBackward,
    faStepForward
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { CollectionNav } from "nampi-use-api";
import { useIntl } from "react-intl";
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
}) => {
  const { formatMessage } = useIntl();
  return (
    <div className={clsx("space-x-2 text-xs", className)}>
      <IconButton
        disabled={disabled || !nav?.first}
        onClick={nav?.first}
        icon={faStepBackward}
        label={formatMessage({
          description: "First page button label",
          defaultMessage: "Go to first result page",
        })}
      />
      <IconButton
        disabled={disabled || !nav?.previous}
        onClick={nav?.previous}
        icon={faBackward}
        label={formatMessage({
          description: "Previous page button label",
          defaultMessage: "Go to previous result page",
        })}
      />
      <span className="w-3 inline-block text-center">{page || ""}</span>
      <IconButton
        disabled={disabled || !nav?.next}
        onClick={nav?.next}
        icon={faForward}
        label={formatMessage({
          description: "Next page button label",
          defaultMessage: "Go to next result page",
        })}
      />
      <IconButton
        disabled={disabled || !nav?.last}
        onClick={nav?.last}
        icon={faStepForward}
        label={formatMessage({
          description: "Last page button label",
          defaultMessage: "Go to last result page",
        })}
      />
    </div>
  );
};
