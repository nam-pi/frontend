import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const About = () => (
  <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.about} />
);
