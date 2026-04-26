import { create } from "zustand";
import { ThemeMode } from "../../core/theme/colors";

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  themeMode: "dark",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
