import { API_ENTRYPOINT } from "./constants";
import { buildPath } from "./utils/buildPath";

const docBase = buildPath(API_ENTRYPOINT, "doc") + "#";
const schemaOrgBase = "https://schema.org/";

export const doc = {
  textVariable: `${docBase}textVariable`,
};

export const schemaOrg = {
  email: `${schemaOrgBase}email`,
  name: `${schemaOrgBase}name`,
  givenName: `${schemaOrgBase}givenName`,
  familyName: `${schemaOrgBase}familyName`,
  sameAs: `${schemaOrgBase}sameAs`,
};
