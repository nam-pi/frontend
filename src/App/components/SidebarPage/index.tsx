import { ReactNode } from "react";
import { PageContent } from "../PageContent";

interface Props {
  main: ReactNode;
  sidebar: ReactNode;
}

export const SidebarPage = ({ main, sidebar }: Props) => (
  <PageContent className="sm:flex-1 flex-col-reverse sm:flex-row sm:overflow-hidden sm:h-full">
    <aside className="flex flex-col sm:w-64 lg:w-80 px-4 py-2 mb-2 sm:mb-0 sm:shadow-lg rounded-lg border-2">
      {sidebar}
    </aside>
    <main className="mb-4 flex flex-col flex-1 px-4 py-2 space-y-4 sm:mb-0 sm:ml-6 sm:h-full bg-gray-50 sm:shadow-lg rounded-lg border-2 sm:overflow-y-auto">
      {main}
    </main>
  </PageContent>
);
