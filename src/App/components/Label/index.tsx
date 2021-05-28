import clsx from "clsx";
import { LabelHTMLAttributes } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = ({ className, ...props }: Props) => (
  <label {...props} className={clsx("w-min", "whitespace-nowrap", className)} />
);
