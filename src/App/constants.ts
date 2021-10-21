import { createBrowserHistory } from "history";

export interface TextDefinitions {
  [locale: string]: string;
}

export const APP_NAME = process.env.REACT_APP_NAME;

export const HISTORY = createBrowserHistory();

export const HOME_TEXTS: TextDefinitions = JSON.parse(
  process.env.REACT_APP_HOME_TEXTS?.replaceAll("\n", "\\n") || "{}"
);

export const SECONDARY_ITEM_LIMIT = 20;

export const EXTERNAL_DOCS = {
  home:
    process.env.REACT_APP_CONTENT_HOME ||
    "https://raw.githubusercontent.com/nam-pi/frontend-assets/main/texts/home/",
};
