import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../../../src/presentation/components/ScreenContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../src/core/theme";
import { Button } from "../../../src/presentation/components/Button";
import { GlassCard } from "../../../src/presentation/components/GlassCard";
import { Camera, PenLine } from "lucide-react-native";

export default function AddBillScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer
      title="Add Bill"
      navBarLeading={{ type: "backButton" }}
      isLargeTitle={false}
    >
      <GlassCard
        style={styles.option}
        onPress={() => router.push("/split/scan")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <Camera size={20} color={colors.accent.primary} />
          <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
            Scan Receipt
          </Text>
        </View>
        <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
          Take a photo or pick from gallery
        </Text>
      </GlassCard>

      <GlassCard
        style={styles.option}
        onPress={() => router.push("/split/manual-entry")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <PenLine size={20} color={colors.accent.primary} />
          <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
            Manual Entry
          </Text>
        </View>
        <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
          Type in items and prices manually
        </Text>
      </GlassCard>

      <Button
        title="Cancel"
        variant="ghost"
        onPress={() => router.back()}
        fullWidth
        style={{ marginTop: 16 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  option: { marginBottom: 12 },
  optionTitle: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
});
