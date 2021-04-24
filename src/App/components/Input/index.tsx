import clsx from "clsx";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLInputElement> {}

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
      className
    )}
  />
);
