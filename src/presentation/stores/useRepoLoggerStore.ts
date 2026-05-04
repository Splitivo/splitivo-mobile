import { create } from "zustand";

export interface RepoLogEntry {
  id: string;
  repoClass: string;
  functionName: string;
  parameters: unknown[];
  response: unknown;
  error?: string;
  timestamp: Date;
  durationMs: number;
}

interface RepoLoggerState {
  logs: RepoLogEntry[];
  addLog: (entry: Omit<RepoLogEntry, "id">) => void;
  clearLogs: () => void;
}

export const useRepoLoggerStore = create<RepoLoggerState>((set) => ({
  logs: [],
  addLog: (entry) =>
    set((state) => ({
      logs: [
        {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
        ...state.logs,
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));
