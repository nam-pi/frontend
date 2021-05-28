import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, type = "text", ...props }: Props) => (
  <input
    {...props}
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
);
