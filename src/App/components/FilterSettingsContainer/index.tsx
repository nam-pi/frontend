import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const FilterSettingsContainer = ({ children }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">{children}</div>
);
