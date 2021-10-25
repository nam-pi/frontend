import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const Imprint = () => (
  <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.imprint} />
);
