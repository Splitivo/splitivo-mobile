import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "../../src/core/theme";

export default function SplitLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.primary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="scan" />
      <Stack.Screen name="manual-entry" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="[id]/index" />
      <Stack.Screen name="[id]/bill-detail" />
      <Stack.Screen name="[id]/receipt" />
    </Stack>
  );
}
