import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "../../src/core/theme";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.primary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
