import HydraClientFactory from "@hydra-cg/heracles.ts";

export const API_ENTRYPOINT: string = process.env
  .REACT_APP_API_ENTRYPOINT as string;

export const HYDRA_CLIENT = HydraClientFactory.configure()
  .withDefaults()
  .andCreate();

export const SEARCH_TIMEOUT = 200;
