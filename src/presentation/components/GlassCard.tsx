import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../core/theme";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  /** Use glass-strong: higher opacity, more blur, 24px radius */
  strong?: boolean;
}

export function GlassCard({
  children,
  onPress,
  style,
  strong = false,
}: GlassCardProps) {
  const { resolvedMode, colors } = useTheme();
  const isLiquidGlassEnabled = useLiquidGlass();
  const radius = strong ? 24 : 16;
  const blurIntensity = strong
    ? resolvedMode === "dark"
      ? 60
      : 80
    : resolvedMode === "dark"
      ? 40
      : 60;

  const innerContent = (
    <View
      style={[
        styles.inner,
        {
          borderRadius: radius,
          borderColor: isLiquidGlassEnabled
            ? "transparent"
            : colors.border.default,
          borderWidth: isLiquidGlassEnabled ? 0 : 1,
        },
      ]}
    >
      {children}
    </View>
  );

  const content = isLiquidGlassEnabled ? (
    <GlassView
      glassEffectStyle={strong ? "regular" : "clear"}
      colorScheme={resolvedMode === "dark" ? "dark" : "light"}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      {innerContent}
    </GlassView>
  ) : (
    <BlurView
      intensity={blurIntensity}
      tint={resolvedMode}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      {innerContent}
    </BlurView>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.shadow, { borderRadius: radius }]}
      >
        {({ pressed }) => (
          <View
            style={[
              { borderRadius: radius, overflow: "hidden" },
              {
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            {content}
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={[styles.shadow, { borderRadius: radius }]}>
      <View style={{ borderRadius: radius, overflow: "hidden" }}>
        {content}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    padding: 16,
  },
  shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
