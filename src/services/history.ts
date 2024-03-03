import { createContext, useContext } from "react";

export interface IHistory {
  data: { question: string; answer: string; yourAnswer: string };
  solved: boolean;
}

const historyStore = createContext<IHistory[]>([]);
export const HistoryProvider = historyStore.Provider;
export const useHistory = () => useContext(historyStore);
