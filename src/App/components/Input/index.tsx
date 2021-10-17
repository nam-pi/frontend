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
        type === "checkbox" ? "items-center" : "w-full",
        "flex rounded border bg-gray-400 border-gray-400 shadow focus-within:border-blue-400 focus-within:bg-blue-400"
      )}
    >
      {label && (
        <label
          className="min-w-6 px-2 focus-visible:ring-red-400 rounded-l py-1 bg-transparent text-white"
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
        className={clsx(
          type === "checkbox"
            ? "p-4 rounded-tr rounded-br border-blue-400 cursor-pointer"
            : "py-1 pl-2 rounded-r bg-white w-full",
          !label && "rounded-l",
          "border-none shadow-none outline-none focus:ring-transparent focus:border-transparent focus:outline-none focus:shadow-outline focus:border-none"
        )}
      />
    </div>
  )
);
