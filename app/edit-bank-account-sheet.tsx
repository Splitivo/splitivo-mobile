import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { Text } from "../src/presentation/components/Text";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../src/core/theme";
import { useUserStore } from "../src/presentation/stores/useUserStore";
import { BottomSheetScreen } from "../src/presentation/components/BottomSheetScreen";
import { CreditCard, Star, Trash2 } from "lucide-react-native";
import { X } from "lucide-react-native";

export default function EditBankAccountSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, resolvedMode } = useTheme();
  const { user, removeBankAccount, setDefaultBankAccount } = useUserStore();
  const isDark = resolvedMode === "dark";

  const accountIndex = user?.bankAccounts.findIndex((a) => a.id === id) ?? -1;
  const account = accountIndex >= 0 ? user!.bankAccounts[accountIndex] : null;
  if (!account) return null;

  const handleMakeDefault = async () => {
    router.back();
    await setDefaultBankAccount(account.id);
  };

  const handleDelete = () => {
    router.back();
    setTimeout(() => {
      Alert.alert(
        "Remove Account",
        `Remove ${account.bankName} account ending in ${account.accountNumber.slice(-4)}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              await removeBankAccount(account.id);
            },
          },
        ],
      );
    }, 400);
  };

  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <BottomSheetScreen
      title="Edit Account"
      trailingItem={{
        icon: <X size={20} color={colors.text.secondary} />,
        callback: () => router.back(),
      }}
    >
      <View style={styles.content}>
        {/* Bank card preview */}
        <View style={[styles.bankCard, { backgroundColor: account.color }]}>
          <View style={styles.bankOrb} />
          <View style={styles.bankTop}>
            <Text style={styles.bankName}>{account.bankName}</Text>
            <CreditCard size={20} color="rgba(255,255,255,0.8)" />
          </View>
          <Text style={styles.bankNumber}>{account.accountNumber}</Text>
          {account.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View
          style={[
            styles.actionsSection,
            {
              borderColor: dividerColor,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          {!account.isDefault && (
            <Pressable
              onPress={handleMakeDefault}
              style={({ pressed }) => [
                styles.actionRow,
                { borderBottomColor: dividerColor, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: "#22C55E20" }]}
              >
                <Star size={16} color="#22C55E" />
              </View>
              <Text
                style={[styles.actionLabel, { color: colors.text.primary }]}
              >
                Make Default
              </Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.actionRow,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#EF444420" }]}>
              <Trash2 size={16} color="#EF4444" />
            </View>
            <Text
              style={[styles.actionLabel, { color: colors.text.destructive }]}
            >
              Remove Account
            </Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 16,
  },

  // Card preview
  bankCard: {
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
  bankOrb: {
    position: "absolute",
    top: -32,
    right: -32,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  bankTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  bankName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Geist_600SemiBold",
    letterSpacing: -0.2,
  },
  bankNumber: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontFamily: "monospace",
    letterSpacing: 3,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  defaultBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Geist_600SemiBold",
  },

  // Info section
  infoSection: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: "Geist_400Regular",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Geist_500Medium",
  },

  // Actions section
  actionsSection: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 15,
    fontFamily: "Geist_500Medium",
  },
});
