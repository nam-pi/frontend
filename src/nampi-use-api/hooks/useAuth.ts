import { UseAuth } from "../types";
import { useNampiContext } from "./useNampiContext";

export const useAuth = (): UseAuth => {
  const { initialized, authenticated, login, logout } = useNampiContext();
  return { initialized, authenticated, login, logout };
};
