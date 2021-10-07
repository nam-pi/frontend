import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, TextareaHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { className, id = String(+new Date() * Math.random()), label, ...props },
    ref
  ) => (
    <div
      className={clsx(
        className,
        "w-full flex rounded border border-gray-400 shadow focus-within:ring-2 focus-visible:ring-2 focus-within:ring-offset-2 focus-within:ring-current"
      )}
    >
      {label && (
        <label className="min-w-6 px-2 py-1 bg-gray-400 text-white">
          {label}
        </label>
      )}
      <textarea
        {...props}
        ref={ref}
        className="py-1 px-2 w-full bg-transparent border-none shadow-none outline-none focus:ring-transparent focus:border-transparent focus:outline-none focus:shadow-outline focus:border-none"
      />
    </div>
  )
);
