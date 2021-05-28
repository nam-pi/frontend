import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className = "", type, ...props }: Props) => {
  let defaultClasses = "disabled:opacity-50";
  if (!className.includes("p-") && !className.includes("px-")) {
    defaultClasses += " px-2";
  }
  if (!className.includes("p-") && !className.includes("py-")) {
    defaultClasses += " py-1";
  }
  if (!className.includes("shadow")) {
    defaultClasses += " shadow";
  }
  if (!className.includes("border")) {
    defaultClasses += " border border-gray-400 border";
  }
  if (!className.includes("rounded")) {
    defaultClasses += " rounded";
  }
  if (!className.includes("hover")) {
    defaultClasses += " hover:opacity-80";
  }
  if (!className.includes("focus")) {
    defaultClasses +=
      " focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current";
  }

  return (
    <button
      {...props}
      type={type || "button"}
      className={clsx(defaultClasses, className)}
    />
  );
};
