import HydraClientFactory from "@hydra-cg/heracles.ts";
import Keycloak from "keycloak-js";
import { callFacility } from "./callFacility";
import { ItemType } from "./enums/ItemType";

export const API_ENTRYPOINT: string = process.env
  .REACT_APP_API_ENTRYPOINT as string;

export const HYDRA_CLIENT = HydraClientFactory.configure()
  .withDefaults()
  .with(callFacility)
  .andCreate();

export const KEYCLOAK_CLIENT = Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_AUTH_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM || "nampi",
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "nampi-website",
});

export const PATH_BASES = {
  single: {
    [ItemType.Person]: "person",
  },
  collection: {
    [ItemType.Person]: "persons",
  },
};

export const SEARCH_TIMEOUT = 200;
