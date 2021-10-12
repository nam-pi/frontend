import { ReactNode } from "react";

export const EditorForm = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => (
  <form className="grid grid-flow-row gap-6 divide-gray-100">{children}</form>
);
