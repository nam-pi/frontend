import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icon } from "../Icon";

type OptionValue = string | number | unknown[] | Record<string, unknown>;

export interface Option<V extends OptionValue> {
  value: V;
  text: string;
}

interface Props<V extends OptionValue> {
  className?: string;
  id?: string;
  options: Option<V>[];
  selected?: V | Option<V>;
  onChange?: (value: Option<V>) => void;
}

const isOption = <V extends OptionValue>(
  value: undefined | V | Option<V>
): value is Option<V> =>
  value !== undefined && (value as Option<V>).text !== undefined;

export const Select = <V extends OptionValue = string>({
  className,
  id,
  onChange = () => undefined,
  options,
  selected: externalValue,
}: Props<V>) => {
  const value = useMemo(
    () =>
      options.find(
        (o) =>
          o.value ===
          (isOption<V>(externalValue) ? externalValue.value : externalValue)
      ),
    [externalValue, options]
  );
  const [selected, setSelected] = useState<Option<V>>(value || options[0]);
  const handleChange = useCallback(
    (option: Option<V>) => {
      setSelected(option);
      onChange(option);
    },
    [onChange]
  );

  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  return (
    <div className={className}>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button
            className="relative rounded border border-gray-400 shadow disabled:opacity-50 px-2 py-1 w-full flex flex-row justify-between items-center focus:outline-none focus-within:border-blue-400"
            id={id}
          >
            <span className="block truncate">{selected.text}</span>
            <Icon className="ml-2 text-gray-500" icon={faCaretDown} />
          </Listbox.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Listbox.Options className="max-h-64 w-full overflow-y-auto shadow bg-white border border-gray-400 rounded py-1 absolute right-0 z-10 mt-2 focus:outline-none focus-within:border-blue-400">
              {options.map((value, idx) => (
                <Listbox.Option key={idx} value={value}>
                  {({ active, selected }) => {
                    return (
                      <div
                        className={clsx(
                          "px-2",
                          "py-1",
                          "text-black",
                          "min-w-min",
                          active
                            ? ["bg-gray-200", "cursor-pointer"]
                            : selected
                            ? "bg-gray-100"
                            : "bg-white "
                        )}
                      >
                        {value.text}
                      </div>
                    );
                  }}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
