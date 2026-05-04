import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeProvider, useTheme } from "../src/core/theme";
import { useLiquidGlass } from "../src/hooks/useLiquidGlass";
import { useUIStore } from "../src/presentation/stores/useUIStore";
import { useAuthStore } from "../src/presentation/stores/useAuthStore";
import { FloatingDebugButton } from "../src/presentation/components/FloatingDebugButton";
import {
  useFonts,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from "@expo-google-fonts/geist";
import { Toaster } from "sonner-native";
import "../global.css";

const DARK_GRADIENT = ["#141414", "#0A0A0A", "#000000"] as const;
const LIGHT_GRADIENT = ["#FFFFFF", "#F5F5F5", "#EBEBEB"] as const;

function RootLayoutInner() {
  const { resolvedMode, colors } = useTheme();
  const isDark = resolvedMode === "dark";
  const isLiquidGlass = useLiquidGlass();
  const sheetPresentation = isLiquidGlass ? "formSheet" : "modal";
  const hydrateLiquidGlass = useUIStore((s) => s.hydrateLiquidGlass);
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    hydrateLiquidGlass();
  }, []);

  useEffect(() => {
    if (session) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/sign-in");
    }
  }, [session]);

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
            sheetAllowedDetents: "fitToContents",
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
          name="edit-bank-account-sheet"
          options={{
            headerShown: false,
            presentation: "formSheet",
            sheetAllowedDetents: "fitToContents",
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
      <FloatingDebugButton />
      <Toaster
        position="bottom-center"
        theme={isDark ? "dark" : "light"}
        duration={1200}
        toastOptions={{
          style: {
            backgroundColor: isDark
              ? "rgba(20, 20, 20, 0.92)"
              : "rgba(255, 255, 255, 0.92)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.10)"
              : "rgba(0, 0, 0, 0.08)",
            borderRadius: 14,
          },
          titleStyle: {
            fontFamily: "Geist_500Medium",
            fontSize: 14,
            color: isDark ? "#FFFFFF" : "#0A0A0A",
          },
        }}
      />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
