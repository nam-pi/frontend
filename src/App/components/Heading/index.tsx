import clsx from "clsx";
import { createElement, HTMLProps } from "react";

interface Props extends HTMLProps<HTMLHeadingElement> {
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
    { ...props, className: clsx("text-2xl", className) },
    children
  );
};
