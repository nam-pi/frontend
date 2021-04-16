import HydraClientFactory from "@hydra-cg/heracles.ts";
import { ItemType } from "./enums/ItemType";

export const API_ENTRYPOINT: string = process.env
  .REACT_APP_API_ENTRYPOINT as string;

export const HYDRA_CLIENT = HydraClientFactory.configure()
  .withDefaults()
  .andCreate();

export const PATH_BASES = {
  single: {
    [ItemType.Person]: "person",
  },
  collection: {
    [ItemType.Person]: "persons",
  },
};

export const SEARCH_TIMEOUT = 200;
