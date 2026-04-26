import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "../src/core/theme";
import { GlassCard } from "../src/presentation/components/GlassCard";
import { BottomSheetScreen } from "../src/presentation/components/BottomSheetScreen";
import { Receipt, Plane } from "lucide-react-native";

export default function BillTypeSelectionSheet() {
  const { colors } = useTheme();

  return (
    <BottomSheetScreen>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          New Split
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          How would you like to split?
        </Text>

        <GlassCard
          onPress={() => {
            router.dismiss();
            router.push("/split/scan");
          }}
          style={styles.optionCard}
        >
          <View style={styles.optionInner}>
            <Receipt size={36} color={colors.accent.primary} />
            <View style={styles.optionText}>
              <Text
                style={[styles.optionTitle, { color: colors.text.primary }]}
              >
                Single Bill
              </Text>
              <Text
                style={[styles.optionDesc, { color: colors.text.secondary }]}
              >
                One-time split with friends
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard
          onPress={() => {
            router.dismiss();
            router.push("/trip/create");
          }}
          style={styles.optionCard}
        >
          <View style={styles.optionInner}>
            <Plane size={36} color={colors.accent.primary} />
            <View style={styles.optionText}>
              <Text
                style={[styles.optionTitle, { color: colors.text.primary }]}
              >
                Trip Split
              </Text>
              <Text
                style={[styles.optionDesc, { color: colors.text.secondary }]}
              >
                Group trip with multiple bills
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </BottomSheetScreen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 32 },
  optionCard: {
    marginBottom: 16,
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  optionText: { flex: 1 },
  optionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 2 },
  optionDesc: { fontSize: 13 },
});
