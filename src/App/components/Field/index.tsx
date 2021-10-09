import { ReactNode } from "react";
import { Label } from "../Label";

export const Field = ({
  children,
  label,
}: {
  children: ReactNode;
  label: ReactNode;
}) => (
  <div>
    <Label className="text-lg">{label}</Label>
    <div className="mt-1">{children}</div>
  </div>
);
