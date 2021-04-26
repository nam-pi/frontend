import clsx from "clsx";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLParagraphElement> {}

export const Paragraph = ({ className, ...props }: Props) => (
  <p {...props} className={clsx(className)} />
);
