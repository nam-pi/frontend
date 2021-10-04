import { useAuth } from "nampi-use-api";
import { useParams } from "react-router-dom";
import { useQuery } from "./useQuery";

interface Params {
  idLocal: string;
}

interface EntityUrl {
  edit?: boolean;
  idLocal?: string;
}

export const useEntityUrl = (): EntityUrl => {
  const { authenticated } = useAuth();
  const { idLocal } = useParams<Params>();
  const urlQuery = useQuery();
  return {
    edit: authenticated && urlQuery.get("edit") !== null,
    idLocal,
  };
};
