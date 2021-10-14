import { createContext } from "react";
import { DEFAULT_CONTEXT_STATE } from "../constants";
import { ContextState } from "../types";

export const NampiContext = createContext<ContextState>(DEFAULT_CONTEXT_STATE);
