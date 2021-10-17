import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export const PlaceholderText = ({ children, className }: Props) => (
  <span className={clsx("text-gray-400", className)}>{children}</span>
);
