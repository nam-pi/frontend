import clsx from "clsx";
import { createElement, HTMLAttributes } from "react";

export interface Props extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading = ({
  level = 1,
  className,
  children,
  ...props
}: Props) => {
  const tag = `h${level}` as keyof JSX.IntrinsicElements;
  return createElement(
    tag,
    {
      ...props,
      className: clsx(level === 1 ? "text-2xl" : "text-xl", className),
    },
    children
  );
};
