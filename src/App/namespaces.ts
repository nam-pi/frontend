import { API_ENTRYPOINT } from "./constants";
import { buildPath } from "./utils/buildPath";

const coreBase = "https://purl.org/nampi/owl/core#";
const docBase = buildPath(API_ENTRYPOINT, "doc") + "#";
const schemaOrgBase = "https://schema.org/";

export const core = {
  diesIn: `${coreBase}dies_in`,
  isBornIn: `${coreBase}is_born_in`,
  takesPlaceNotLaterThan: `${coreBase}takes_place_not_later_than`,
  takesPlaceNotEarlierThan: `${coreBase}takes_place_not_earlier_than`,
  takesPlaceOn: `${coreBase}takes_place_on`,
  hasSortingDate: `${coreBase}has_sorting_date`,
  hasXsdDateTime: `${coreBase}has_xsd_date_time`,
};

export const doc = {
  personOrderByVariable: `${docBase}personOrderByVariable`,
  textVariable: `${docBase}textVariable`,
};

export const schemaOrg = {
  email: `${schemaOrgBase}email`,
  name: `${schemaOrgBase}name`,
  givenName: `${schemaOrgBase}givenName`,
  familyName: `${schemaOrgBase}familyName`,
  sameAs: `${schemaOrgBase}sameAs`,
};
