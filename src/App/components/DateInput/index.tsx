import clsx from "clsx";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Input } from "../Input";

export interface Dates {
  exact?: string;
  start?: string;
  end?: string;
}

export interface Props {
  className?: string;
  onChange?: (value: Dates) => void;
  value?: Dates;
}

export const DateInput = ({ className, onChange = () => {}, value }: Props) => {
  const intl = useIntl();
  const oldDates = useRef<typeof value>(value);
  const [range, setRange] = useState<boolean>(
    value?.exact === undefined &&
      value?.start !== undefined &&
      value?.end !== undefined
  );
  const [start, setStart] = useState(range ? value?.start : value?.exact);
  const [end, setEnd] = useState(value?.end);
  const datePlaceholder = intl.formatMessage(
    {
      description: "Date placeholder",
      defaultMessage: "Enter a date like {date}",
    },
    { date: format(new Date(), "yyyy-MM-dd") }
  );
  useEffect(() => {
    if (value !== oldDates.current) {
      oldDates.current = value;
      const newRange =
        value?.exact === undefined &&
        value?.start !== undefined &&
        value?.end !== undefined;
      const newStart = newRange ? value?.start : value?.exact;
      const newEnd = value?.end;
      setRange(newRange);
      setStart(newStart);
      setEnd(newEnd);
    }
  }, [value]);
  return (
    <div
      className={clsx(
        className,
        "w-full flex flex-col md:flex-row items-start md:justify-between"
      )}
    >
      <Input
        label={
          range
            ? intl.formatMessage({
                description: "Not before input label",
                defaultMessage: "Not before",
              })
            : intl.formatMessage({
                description: "Exact input label",
                defaultMessage: "Exact",
              })
        }
        onChange={(e) => {
          const newStart = e.target.value;
          const newDates = {
            exact: range ? undefined : newStart,
            start: range ? newStart : undefined,
            end: range ? end : undefined,
          };
          oldDates.current = newDates;
          onChange(newDates);
          setStart(newStart);
        }}
        placeholder={datePlaceholder}
        value={start || ""}
      />
      {range && (
        <Input
          className="mt-2 md:mt-0 md:ml-4"
          label={intl.formatMessage({
            description: "Not after input label",
            defaultMessage: "Not after",
          })}
          onChange={(e) => {
            const newEnd = e.target.value;
            const newDates = {
              exact: range ? undefined : start,
              start: range ? start : undefined,
              end: range ? newEnd : undefined,
            };
            oldDates.current = newDates;
            onChange(newDates);
            setEnd(newEnd);
          }}
          placeholder={datePlaceholder}
          value={end || ""}
        />
      )}
      <Input
        className="mt-2 md:mt-0 md:ml-4"
        label={intl.formatMessage({
          description: "Range checkbox",
          defaultMessage: "Uncertain",
        })}
        type="checkbox"
        checked={range}
        onChange={(e) => {
          const newRange = e.target.checked;
          const newDates = {
            exact: newRange ? undefined : start,
            start: newRange ? start : undefined,
            end: newRange ? end : undefined,
          };
          oldDates.current = newDates;
          onChange(newDates);
          setRange(newRange);
        }}
      />
    </div>
  );
};
