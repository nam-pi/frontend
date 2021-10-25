import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const FilterSettingsContainer = ({ children }: Props) => (
  <div className="space-y-4 pb-4">{children}</div>
);
