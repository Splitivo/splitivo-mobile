import React, { useRef, useState } from "react";
import { StyleSheet, View, PanResponder, Dimensions } from "react-native";
import { Bug } from "lucide-react-native";
import { router } from "expo-router";
import { appConfig } from "../../core/config/environment";

const BUTTON_SIZE = 44;
const EDGE_PADDING = 16;

/**
 * A draggable floating debug button rendered above all screens.
 * Only visible in `dev` and `smoke` environments.
 */
export function FloatingDebugButton() {
  if (appConfig.env === "prod") return null;

  const { width, height } = Dimensions.get("window");

  const [pos, setPos] = useState({
    x: width - BUTTON_SIZE - EDGE_PADDING,
    y: height * 0.6,
  });

  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: (_, g) => {
        dragging.current = false;
        origin.current = { x: g.x0, y: g.y0 };
      },
      onPanResponderMove: (_, g) => {
        dragging.current = true;
        const { width: w, height: h } = Dimensions.get("window");
        const nextX = Math.min(
          Math.max(g.moveX - BUTTON_SIZE / 2, EDGE_PADDING),
          w - BUTTON_SIZE - EDGE_PADDING,
        );
        const nextY = Math.min(
          Math.max(g.moveY - BUTTON_SIZE / 2, EDGE_PADDING),
          h - BUTTON_SIZE - EDGE_PADDING,
        );
        setPos({ x: nextX, y: nextY });
      },
      onPanResponderRelease: () => {
        if (!dragging.current) {
          router.push("/debug-sheet" as any);
        }
        dragging.current = false;
      },
    }),
  ).current;

  return (
    <View
      style={[styles.button, { left: pos.x, top: pos.y }]}
      {...panResponder.panHandlers}
    >
      <Bug size={20} color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "rgba(239,68,68,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    elevation: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
