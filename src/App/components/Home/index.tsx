import { EXTERNAL_DOCS } from "App/constants";
import { FetchedMarkdownPage } from "../FetchedMarkdownPage";

export const Home = () => <FetchedMarkdownPage baseUrl={EXTERNAL_DOCS.home} />;
