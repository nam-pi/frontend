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
  about: process.env.REACT_APP_CONTENT_ABOUT,
  data: process.env.REACT_APP_CONTENT_DATA,
  dataModel: process.env.REACT_APP_CONTENT_DATA_MODEL,
  home: process.env.REACT_APP_CONTENT_HOME,
  imprint: process.env.REACT_APP_CONTENT_IMPRINT,
  privacy: process.env.REACT_APP_CONTENT_PRIVACY,
};
