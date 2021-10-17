import clsx from "clsx";
import {
    DetailedHTMLProps,
    forwardRef,
    ReactNode,
    TextareaHTMLAttributes
} from "react";

interface Props
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { className, id = String(+new Date() * Math.random()), label, ...props },
    ref
  ) => (
    <div
      className={clsx(
        className,
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
      <textarea
        {...props}
        id={id}
        ref={ref}
        className={clsx(
          !label && "rounded-l",
          "py-1 pl-2 rounded-r w-full border-none bg-white shadow-none outline-none focus:ring-transparent focus:border-transparent focus:outline-none focus:shadow-outline focus:border-none"
        )}
      />
    </div>
  )
);
