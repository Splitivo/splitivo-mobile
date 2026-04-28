import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "../../core/theme/colors";

const LIQUID_GLASS_KEY = "@splitivo/liquid-glass-enabled";

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  liquidGlassEnabled: boolean;
  setLiquidGlassEnabled: (enabled: boolean) => void;
  hydrateLiquidGlass: () => Promise<void>;
}

export const useUIStore = create<UIState>((set) => ({
  themeMode: "dark",
  setThemeMode: (mode) => set({ themeMode: mode }),
  liquidGlassEnabled: true,
  setLiquidGlassEnabled: (enabled) => {
    set({ liquidGlassEnabled: enabled });
    AsyncStorage.setItem(LIQUID_GLASS_KEY, String(enabled));
  },
  hydrateLiquidGlass: async () => {
    const stored = await AsyncStorage.getItem(LIQUID_GLASS_KEY);
    if (stored !== null) {
      set({ liquidGlassEnabled: stored === "true" });
    }
  },
}));
