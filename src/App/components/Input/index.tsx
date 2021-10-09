import clsx from "clsx";
import {
    DetailedHTMLProps,
    forwardRef,
    InputHTMLAttributes,
    ReactNode
} from "react";

export interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      id = String(+new Date() * Math.random()),
      label,
      type = "text",
      ...props
    },
    ref
  ) => (
    <div
      className={clsx(
        className,
        "w-full flex rounded border border-gray-400 shadow focus-within:ring-2 focus-visible:ring-2 focus-within:ring-offset-2 focus-within:ring-current"
      )}
    >
      {label && (
        <label
          className="min-w-6 px-2 py-1 bg-gray-400 text-white"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        ref={ref}
        type={type}
        className="py-1 px-2 w-full bg-transparent border-none shadow-none outline-none focus:ring-transparent focus:border-transparent focus:outline-none focus:shadow-outline focus:border-none"
      />
    </div>
  )
);
