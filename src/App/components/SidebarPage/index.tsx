import { ReactNode } from "react";

interface Props {
  main: ReactNode;
  sidebar: ReactNode;
}

export const SidebarPage = ({ main, sidebar }: Props) => (
  <div className="flex sm:flex-1 flex-col-reverse sm:flex-row sm:overflow-hidden sm:h-full">
    <aside className="flex flex-col sm:w-64 lg:w-80 px-4 py-2 mb-2 sm:mb-0 sm:shadow-lg rounded-lg border-2 border-primary-500">
      {sidebar}
    </aside>
    <main className="w-auto mb-4 sm:mb-0 sm:ml-6">{main}</main>
  </div>
);
