import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className = "", type, ...props }: Props) => {
  let defaultClasses =
    "disabled:opacity-50 disabled:cursor-default border focus:outline-none hover:opacity-80 rounded";
  if (!className.includes("p-") && !className.includes("px-")) {
    defaultClasses += " px-2";
  }
  if (!className.includes("p-") && !className.includes("py-")) {
    defaultClasses += " py-1";
  }
  if (!className.includes("text-")) {
    defaultClasses += " text-gray-500";
  }
  if (!className.includes("border")) {
    defaultClasses +=
      " border-gray-500 focus-visible:border-blue-400 focus-visible:ring-gray-500 focus-visible:ring-1";
  }
  return (
    <button
      {...props}
      type={type || "button"}
      className={clsx(defaultClasses, className)}
    />
  );
};
