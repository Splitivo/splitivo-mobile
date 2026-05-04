import { useEffect, useRef } from "react";
import { Accelerometer } from "expo-sensors";
import { router } from "expo-router";
import { appConfig, Environment } from "../core/config/environment";

const SHAKE_THRESHOLD = 1.8; // G-force delta — works for both simulator and physical device
const SHAKE_COOLDOWN_MS = 1500;

/**
 * Listens for a shake gesture (Ctrl+Cmd+Z in simulator, physical shake on device)
 * and opens the debug bottom sheet.
 * Only active in `dev` and `smoke` environments.
 * Uses only the Accelerometer to avoid conflicting with Expo's dev menu.
 */
export function useShakeToDebug() {
  const lastShakeAt = useRef(0);
  const prev = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (appConfig.env === Environment.Prod) return;

    Accelerometer.setUpdateInterval(100);

    const accelSub = Accelerometer.addListener(({ x, y, z }) => {
      const dx = Math.abs(x - prev.current.x);
      const dy = Math.abs(y - prev.current.y);
      const dz = Math.abs(z - prev.current.z);
      prev.current = { x, y, z };

      const now = Date.now();
      if (
        dx + dy + dz > SHAKE_THRESHOLD &&
        now - lastShakeAt.current > SHAKE_COOLDOWN_MS
      ) {
        lastShakeAt.current = now;
        router.push("/debug-sheet" as any);
      }
    });

    return () => accelSub.remove();
  }, []);
}
