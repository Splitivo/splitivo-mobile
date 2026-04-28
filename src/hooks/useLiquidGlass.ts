import { useMemo } from "react";
import { Platform } from "react-native";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useUIStore } from "../presentation/stores/useUIStore";

export function useLiquidGlass(): boolean {
  const liquidGlassEnabled = useUIStore((s) => s.liquidGlassEnabled);

  return useMemo(() => {
    if (!liquidGlassEnabled) return false;

    if (Platform.OS !== "ios") return false;

    const iosVersion = parseInt(Platform.Version as unknown as string, 10);
    if (iosVersion < 26) return false;

    return isLiquidGlassAvailable();
  }, [liquidGlassEnabled]);
}
