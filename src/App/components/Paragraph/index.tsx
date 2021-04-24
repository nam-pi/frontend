import clsx from "clsx";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLParagraphElement> {}

export const Paragraph = ({ className, ...props }: Props) => (
  <p {...props} className={clsx(className)} />
);
