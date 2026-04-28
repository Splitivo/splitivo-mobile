import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { Button } from "../../src/presentation/components/Button";
import { ArrowLeft } from "lucide-react-native";

export default function ScanScreen() {
  const { colors } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState<"camera" | "gallery">("camera");

  const handleCapture = () => {
    // Mock: go directly to confirm screen with scan result
    router.push("/split/confirm");
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Scan Receipt
        </Text>
        <Pressable
          style={[
            styles.currencyPill,
            { backgroundColor: colors.bg.container },
          ]}
        >
          <Text style={[styles.currencyText, { color: colors.text.primary }]}>
            {currency}
          </Text>
        </Pressable>
      </View>

      {/* Camera Viewfinder Placeholder */}
      <View style={styles.viewfinder}>
        <View
          style={[styles.scanFrame, { borderColor: colors.accent.primary }]}
        >
          <Text style={[styles.scanText, { color: colors.text.secondary }]}>
            Point camera at receipt
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMode("camera")}
            style={[
              styles.modeButton,
              mode === "camera" && { backgroundColor: colors.accent.primary },
            ]}
          >
            <Text
              style={{
                color:
                  mode === "camera"
                    ? colors.text.onAccent
                    : colors.text.secondary,
                fontWeight: "600",
              }}
            >
              Camera
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("gallery")}
            style={[
              styles.modeButton,
              mode === "gallery" && { backgroundColor: colors.accent.primary },
            ]}
          >
            <Text
              style={{
                color:
                  mode === "gallery"
                    ? colors.text.onAccent
                    : colors.text.secondary,
                fontWeight: "600",
              }}
            >
              Gallery
            </Text>
          </Pressable>
        </View>

        <Button title="Capture" onPress={handleCapture} fullWidth size="lg" />

        <Pressable onPress={() => router.push("/split/manual-entry")}>
          <Text style={[styles.manualLink, { color: colors.accent.primary }]}>
            Enter Manually
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  currencyPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  currencyText: { fontSize: 14, fontWeight: "600" },
  viewfinder: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanFrame: {
    width: "80%",
    aspectRatio: 0.7,
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: { fontSize: 14 },
  controls: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  modeToggle: { flexDirection: "row", gap: 8, justifyContent: "center" },
  modeButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  manualLink: { textAlign: "center", fontSize: 14, fontWeight: "600" },
});
