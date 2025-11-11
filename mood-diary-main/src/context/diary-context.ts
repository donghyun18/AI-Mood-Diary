import { createContext } from "react";
import { DiaryType, DispatchContextType } from "types/diary-types";

export const DiaryStateContext = createContext<DiaryType[]>([]);
export const DiaryDispatchContext = createContext<DispatchContextType | null>(
  null
);
