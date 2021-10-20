import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  ComponentPropsWithoutRef,
  ComponentType,
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { IconButton } from "../IconButton";

interface ComponentProps<V> {
  onChange?: (value: V) => void;
  value?: V;
}

interface Props<V, P extends ComponentProps<V>, T extends ComponentType<P>> {
  addComponent: T;
  onChange?: (values: V[]) => void;
  outputComponent: ComponentType<{ value: V }>;
  props?: Omit<ComponentPropsWithoutRef<T>, "onChange" | "values" | "focus">;
  valid: (value: undefined | V) => boolean;
  values?: V[];
}

export const Repeater = <
  V,
  P extends ComponentProps<V>,
  T extends ComponentType<P>
>({
  addComponent,
  onChange = () => {},
  outputComponent,
  props,
  valid,
  values: externalValues = [],
}: Props<V, P, T>) => {
  const intl = useIntl();
  const inputContainer = useRef<HTMLDivElement>(null);
  const [newValue, setNewValue] = useState<V>();
  const [values, setValues] = useState(externalValues);
  const lastValues = useRef<typeof values>(values);
  const handleAddClick = useCallback(() => {
    if (newValue) {
      const newValues = [...values, newValue];
      lastValues.current = newValues;
      onChange(newValues);
      setNewValue(undefined);
      setValues(newValues);
      const elements = inputContainer.current?.querySelectorAll(
        "input,textarea,select"
      );
      if (elements) {
        (elements[0] as HTMLElement).focus();
      }
    }
  }, [newValue, onChange, values]);
  const handleRemoveClick = useCallback(
    (idx: number) => {
      const newValues = [...values];
      newValues.splice(idx, 1);
      onChange(newValues);
      setNewValue(undefined);
      setValues(newValues);
    },
    [onChange, values]
  );
  useEffect(() => {
    if (externalValues.length !== lastValues.current.length) {
      lastValues.current = values;
      setValues(externalValues);
    }
  }, [externalValues, values]);
  return (
    <div>
      <div className="flex items-start" ref={inputContainer}>
        {createElement(addComponent, {
          ...props,
          onChange: (v: V) => setNewValue(v),
          value: newValue,
        } as unknown as P)}
        <IconButton
          className={clsx(
            "ml-4",
            valid(newValue) &&
              "text-green-400 border-green-400 focus-visible:ring-1 focus-visible:ring-green-400"
          )}
          disabled={!valid(newValue)}
          icon={faPlus}
          label={intl.formatMessage({
            description: "Add item label",
            defaultMessage: "Add new item",
          })}
          onClick={handleAddClick}
        />
      </div>
      {values.length > 0 && (
        <div className="grid grid-flow-row mt-2 mr-11">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="pl-2 flex items-center bg-gray-100 border border-gray-200 rounded-md mb-2 last:mb-0"
            >
              <div className="w-full">
                {createElement(outputComponent, { value })}
              </div>
              <IconButton
                className="border-none text-red-400 focus-visible:ring-red-400"
                label={intl.formatMessage({
                  description: "Delete button label",
                  defaultMessage: "Delete item",
                })}
                onClick={() => handleRemoveClick(idx)}
                icon={faTimes}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
