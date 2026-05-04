import { create } from "zustand";

export type LogLevel = "log" | "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  level: LogLevel;
  tag?: string;
  messages: unknown[];
  timestamp: Date;
}

interface LoggerState {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, "id">) => void;
  clearLogs: () => void;
}

export const useLoggerStore = create<LoggerState>((set) => ({
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
