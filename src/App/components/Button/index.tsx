import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className, ...props }: Props) => (
  <button
    {...props}
    className={clsx(
      "rounded px-2 py-1 border border-gray-400 border-1 shadow disabled:opacity-50",
      className
    )}
  />
);
