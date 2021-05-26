import clsx from "clsx";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLPreElement> {}

export const Pre = ({ children, className, ...props }: Props) => (
  <pre
    {...props}
    className={clsx(
      "font-mono",
      "text-xs",
      "bg-gray-100",
      "p-2",
      "rounded-md",
      className
    )}
  >
    {JSON.stringify(children, null, 2)}
  </pre>
);
