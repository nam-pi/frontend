import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const Privacy = () => (
  <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.privacy} />
);
