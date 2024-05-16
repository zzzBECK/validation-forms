import { useContext } from "react";
import D1ModuleContext from "./moduleProvider";

export const useD1Module = () => useContext(D1ModuleContext);
