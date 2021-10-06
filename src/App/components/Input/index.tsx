import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type={type}
      className={clsx(
        "px-2",
        "py-1",
        "rounded",
        "border-gray-400",
        "shadow",
        "focus:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-current",
        className
      )}
    />
  )
);
