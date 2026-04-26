import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";
import { useTheme } from "../../core/theme";

interface LiquidGlassScreenProps {
  children: ReactNode;
}

export function LiquidGlassScreen({ children }: LiquidGlassScreenProps) {
  const isLiquidGlassEnabled = useLiquidGlass();
  const { colors } = useTheme();

  if (isLiquidGlassEnabled) {
    return (
      <GlassView
        style={[styles.container, { backgroundColor: colors.bg.primary }]}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg.primary }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
