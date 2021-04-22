import { HttpCallFacility } from "@hydra-cg/heracles.ts";
import { KEYCLOAK_CLIENT } from "./constants";

const DEFAULT_CONFIG: RequestInit = {
  headers: {
    Accept: "application/ld+json",
  },
};
export const callFacility: HttpCallFacility = async (url) => {
  const config = { ...DEFAULT_CONFIG };
  if (KEYCLOAK_CLIENT.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${KEYCLOAK_CLIENT.token}`,
    };
  }
  return KEYCLOAK_CLIENT.updateToken(30)
    .then(() => {
      return fetch(url, config);
    })
    .catch(() => {
      return fetch(url, DEFAULT_CONFIG);
    });
};
