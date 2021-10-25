import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const DataModel = () => (
  <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.dataModel} />
);
