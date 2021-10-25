import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const Home = () => {
  return <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.home} />;
};
