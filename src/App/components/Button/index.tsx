import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className = "", ...props }: Props) => {
  let defaultClasses =
    "rounded border border-gray-400 border-1 shadow disabled:opacity-50";
  if (!className.includes("p-") && !className.includes("px-")) {
    defaultClasses += " px-2";
  }
  if (!className.includes("p-") && !className.includes("py-")) {
    defaultClasses += " py-1";
  }

  return <button {...props} className={clsx(defaultClasses, className)} />;
};
