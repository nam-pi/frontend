import clsx from "clsx";
import { ReactNode } from "react";
import { Label } from "../Label";

interface Props {
  children: ReactNode;
  className?: string;
  label: ReactNode;
}

export const Field = ({ children, className, label }: Props) => (
  <div>
    <Label className="text-lg">{label}</Label>
    <div className={clsx(className, "mt-1")}>{children}</div>
  </div>
);
