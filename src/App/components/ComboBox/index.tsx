import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useIntl } from "react-intl";
import { Input, Props as InputProps } from "../Input";

export interface Props extends Omit<InputProps, "type"> {
  options?: string[];
  matches?: string[];
}

export const ComboBox = ({
  className,
  options = [],
  matches = options,
  onChange = () => undefined,
  ...inputProps
}: Props) => {
  const intl = useIntl();
  const inputElement = useRef<HTMLInputElement>(null);
  const listContainer = useRef<HTMLDivElement>(null);
  const fromButton = useRef<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [active, setActive] = useState<number>(-1);

  const expandable = useMemo(
    () =>
      (matches.length === 1 && matches[0] !== inputElement.current?.value) ||
      matches.length > 1,
    [matches]
  );

  const expandTo = useCallback(
    (activeCallback?: (old: number) => number) => {
      if (expandable) {
        if (!expanded) {
          setExpanded(true);
        }
        setActive(activeCallback || 0);
      }
    },
    [expandable, expanded]
  );

  const collapse = useCallback(
    (focus?: boolean) => {
      if (expandable && expanded) {
        setExpanded(false);
        setActive(-1);
        if (focus) {
          inputElement.current?.focus();
          inputElement.current?.select();
        }
      }
    },
    [expandable, expanded]
  );

  const focusNext = useCallback(
    () => expandTo((old) => (old < matches.length - 1 ? old + 1 : old)),

    [expandTo, matches.length]
  );

  const focusPrev = useCallback(
    () => expandTo((old) => (old === 0 ? old : old - 1)),
    [expandTo]
  );

  const fireEvent = useCallback(
    (text: string, focus?: boolean) => {
      const ie = inputElement.current;
      if (ie) {
        const valueSetter = Object.getOwnPropertyDescriptor(ie, "value")?.set;
        const prototype = Object.getPrototypeOf(ie);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(
          prototype,
          "value"
        )?.set;
        if (valueSetter && valueSetter !== prototypeValueSetter) {
          prototypeValueSetter?.call(ie, text);
        } else {
          valueSetter?.call(ie, text);
        }
        ie.dispatchEvent(new Event("input", { bubbles: true }));
        collapse(focus);
      }
    },
    [collapse]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      expandTo();
      onChange(e);
    },
    [expandTo, onChange]
  );

  const handleBlur = useCallback(() => {
    collapse();
  }, [collapse]);

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      expandTo();
      e.target.select();
    },
    [expandTo]
  );

  const handleListClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      fireEvent(e.currentTarget.textContent || "", true);
    },
    [fireEvent]
  );

  const handleExpandToggleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();
      if (expanded) {
        collapse(true);
      } else {
        expandTo();
        fromButton.current = true;
      }
    },
    [collapse, expandTo, expanded]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.code) {
        case "Tab": {
          const text = matches[active];
          if (text && active >= 0) {
            fireEvent(text);
          }
          break;
        }
        case "Escape":
          collapse(true);
          break;
        case "ArrowDown":
          focusNext();
          break;
        case "ArrowUp":
          focusPrev();
          break;
        case "Enter": {
          if (active >= 0) {
            fireEvent(matches[active], true);
            break;
          }
        }
      }
    },
    [active, collapse, fireEvent, focusNext, focusPrev, matches]
  );

  useEffect(() => {
    if (matches.length === 0) {
      collapse();
    }
  }, [collapse, expanded, matches.length]);

  useEffect(() => {
    if (expanded) {
      if (fromButton.current) {
        listContainer.current?.focus();
        fromButton.current = false;
      }
      const active = listContainer.current?.getElementsByClassName("active");
      if (active && active.length > 0) {
        const div = active[0] as HTMLDivElement;
        div.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [active, expanded]);

  return (
    <div
      className={clsx(className, "w-full")}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
    >
      <div className="relative w-full" onKeyDown={handleKeyPress}>
        <Input
          {...inputProps}
          className="relative w-full pr-4"
          onChange={handleChange}
          onFocus={handleInputFocus}
          ref={inputElement}
          type="text"
        />
        <button
          aria-label={intl.formatMessage({
            description: "Expand button label",
            defaultMessage: "Expand item selection menu",
          })}
          className="absolute right-2 top-0 bottom-0 text-gray-500 disabled:opacity-50"
          disabled={!expandable}
          onMouseDown={handleExpandToggleClick}
          tabIndex={-1}
          type="button"
        >
          <FontAwesomeIcon
            icon={expandable && expanded ? faCaretUp : faCaretDown}
          />
        </button>
      </div>
      {expanded && matches.length > 0 && (
        <div
          className="max-h-64 w-full overflow-y-auto shadow bg-white outline-none border border-gray-400 rounded py-1 absolute right-0 z-10 mt-2 p-2"
          onKeyDown={handleKeyPress}
          ref={listContainer}
          tabIndex={-1}
        >
          {matches.map((text, idx) => (
            <div
              className={clsx(
                "cursor-pointer hover:bg-gray-100",
                idx === active && "active bg-gray-200"
              )}
              key={idx}
              onMouseDown={handleListClick}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
