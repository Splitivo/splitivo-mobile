import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeProvider, useTheme } from "../src/core/theme";
import { useLiquidGlass } from "../src/hooks/useLiquidGlass";
import "../global.css";

const DARK_GRADIENT = ["#2D1B5E", "#1A1721", "#0F0D16"] as const;
const LIGHT_GRADIENT = ["#DDD6FE", "#F5F3FF", "#FAFAFA"] as const;

function RootLayoutInner() {
  const { resolvedMode, colors } = useTheme();
  const isDark = resolvedMode === "dark";
  const isLiquidGlass = useLiquidGlass();
  const sheetPresentation = isLiquidGlass ? "formSheet" : "modal";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="split" options={{ headerShown: false }} />
        <Stack.Screen name="trip" options={{ headerShown: false }} />
        <Stack.Screen
          name="bill-type-selection-sheet"
          options={{
            headerShown: false,
            presentation: sheetPresentation,
            sheetAllowedDetents: [0.6],
            sheetInitialDetentIndex: 0,
            sheetExpandsWhenScrolledToEdge: false,
            contentStyle: {
              backgroundColor: isLiquidGlass
                ? colors.bg.sheetGlass
                : colors.bg.sheet,
            },
          }}
        />
        <Stack.Screen
          name="currency-selection-sheet"
          options={{
            headerShown: false,
            presentation: sheetPresentation,
            sheetAllowedDetents: [0.9],
            sheetInitialDetentIndex: 0,
            sheetExpandsWhenScrolledToEdge: false,
            contentStyle: {
              backgroundColor: isLiquidGlass
                ? colors.bg.sheetGlass
                : colors.bg.sheet,
            },
          }}
        />
        <Stack.Screen
          name="debug-sheet"
          options={{
            headerShown: false,
            presentation: sheetPresentation,
            sheetAllowedDetents: [0.9],
            sheetInitialDetentIndex: 0,
            sheetExpandsWhenScrolledToEdge: false,
            contentStyle: {
              backgroundColor: isLiquidGlass
                ? colors.bg.sheetGlass
                : colors.bg.sheet,
            },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
