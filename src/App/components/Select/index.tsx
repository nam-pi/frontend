import clsx from "clsx";
import { HTMLProps } from "react";

interface Props extends HTMLProps<HTMLSelectElement> {}

export const Select = ({ className, ...props }: Props) => (
  <select {...props} className={clsx(className)} />
);
