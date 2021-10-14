import { useContext } from "react";
import { NampiContext } from "../components/NampiContext";
import { ContextState } from "../types";

export const useNampiContext = (): ContextState => useContext(NampiContext);
