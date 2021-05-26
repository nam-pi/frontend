import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const PlaceholderText = ({ children, className }: Props) => (
  <span className={clsx("text-gray-500", className)}>{children}</span>
);
