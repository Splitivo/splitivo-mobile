import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { router } from "expo-router";
import { useTheme, ThemeMode } from "../../src/core/theme";
import { useUserStore } from "../../src/presentation/stores/useUserStore";
import type { User } from "../../src/domain/entities/user";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { SegmentedControl } from "../../src/presentation/components/SegmentedControl";
import { Avatar } from "../../src/presentation/components/Avatar";
import { CardSkeleton } from "../../src/presentation/components/Skeleton";
import { useCurrencyStore } from "../../src/presentation/stores/useCurrencyStore";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import {
  ChevronRight,
  CreditCard,
  Globe,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  Camera,
} from "lucide-react-native";

const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];
const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const BANK_GRADIENTS = [
  { from: "#3B82F6", to: "#4F46E5" }, // blue → indigo
  { from: "#3F3F46", to: "#18181B" }, // zinc
];

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const { user, isLoading, fetchUser } = useUserStore();
  const { selectedCurrency, fetchCurrencies } = useCurrencyStore();

  useEffect(() => {
    fetchUser();
    fetchCurrencies();
  }, []);

  return (
    <ScreenContainer title="Profile">
      {/* User card */}
      <UserCard user={user} isLoading={isLoading} colors={colors} />

      {/* Bank Accounts */}
      <ProfileSection title="Bank Accounts" colors={colors}>
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <>
            {user?.bankAccounts.map((account, i) => (
              <View
                key={account.id}
                style={[
                  styles.bankCard,
                  {
                    backgroundColor:
                      BANK_GRADIENTS[i % BANK_GRADIENTS.length].from,
                  },
                ]}
              >
                {/* Decorative orb */}
                <View style={styles.bankOrb} />
                <View style={styles.bankTop}>
                  <Text style={styles.bankName}>{account.bankName}</Text>
                  <CreditCard size={20} color="rgba(255,255,255,0.8)" />
                </View>
                <Text style={styles.bankNumber}>
                  •••• •••• •••• {account.accountNumber.slice(-4)}
                </Text>
                {account.isDefault && (
                  <View
                    style={[
                      styles.defaultBadge,
                      {
                        backgroundColor: hexWithAlpha(
                          colors.text.onAccent,
                          0.2,
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
            ))}
            <Pressable
              style={[
                styles.addBankBtn,
                {
                  backgroundColor: colors.bg.glass,
                  borderColor: colors.border.default,
                },
              ]}
            >
              <Text
                style={[styles.addBankText, { color: colors.accent.primary }]}
              >
                + Add Bank Account
              </Text>
            </Pressable>
          </>
        )}
      </ProfileSection>

      {/* Currency */}
      <ProfileSection title="Base Currency" colors={colors}>
        <ProfileRow
          icon={Globe}
          label={
            selectedCurrency
              ? `${selectedCurrency.code} — ${selectedCurrency.name}`
              : "Select currency"
          }
          trail={selectedCurrency?.symbol}
          onPress={() => router.push("/currency-selection-sheet")}
          colors={colors}
        />
      </ProfileSection>

      {/* Appearance */}
      <ProfileSection title="Appearance" colors={colors}>
        <SegmentedControl
          options={THEME_MODES}
          labels={THEME_LABELS}
          selected={mode}
          onSelect={setMode}
          delay={250}
        />
      </ProfileSection>

      {/* Preferences */}
      <ProfileSection title="Preferences" colors={colors}>
        <ProfileRow
          icon={Bell}
          label="Notifications"
          trail="On"
          colors={colors}
        />
        <ProfileRow
          icon={CreditCard}
          label="Default Split"
          trail="Equal"
          colors={colors}
        />
      </ProfileSection>

      {/* App */}
      <ProfileSection title="App" colors={colors}>
        <ProfileRow icon={HelpCircle} label="Help & Support" colors={colors} />
        <ProfileRow icon={FileText} label="Privacy Policy" colors={colors} />
        <ProfileRow icon={FileText} label="Terms of Service" colors={colors} />
      </ProfileSection>

      {/* Sign Out */}
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          styles.signOutBtn,
          {
            backgroundColor: colors.bg.glass,
            borderColor: colors.border.default,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <LogOut size={16} color={colors.text.destructive} />
        <Text style={[styles.signOutText, { color: colors.text.destructive }]}>
          Sign Out
        </Text>
      </Pressable>

      <Text style={[styles.versionText, { color: colors.text.tertiary }]}>
        Splitivo v1.0
      </Text>
    </ScreenContainer>
  );
}

// ── Sub-components ──────────────────────────────────────────

type Colors = ReturnType<typeof useTheme>["colors"];

function UserCard({
  user,
  isLoading,
  colors,
}: {
  user: User | null;
  isLoading: boolean;
  colors: Colors;
}) {
  if (isLoading) return <CardSkeleton />;
  return (
    <GlassCard strong style={styles.userCard}>
      <View style={styles.userRow}>
        <View style={styles.avatarWrap}>
          <Avatar name={user?.displayName ?? "U"} size={64} />
          <Pressable
            style={[
              styles.cameraBtn,
              { backgroundColor: colors.accent.primary },
            ]}
          >
            <Camera size={14} color={colors.text.onAccent} />
          </Pressable>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text.primary }]}>
            {user?.displayName ?? "You"}
          </Text>
          <Text style={[styles.userDetail, { color: colors.text.tertiary }]}>
            {user?.phone ?? "—"}
          </Text>
          <Text
            style={[styles.userDetail, { color: colors.text.tertiary }]}
            numberOfLines={1}
          >
            {user?.email ?? "—"}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

function ProfileSection({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text.tertiary }]}>
        {title}
      </Text>
      <View style={styles.sectionRows}>{children}</View>
    </View>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  trail,
  onPress,
  colors,
}: {
  icon: typeof Bell;
  label: string;
  trail?: string;
  onPress?: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileRow,
        {
          backgroundColor: colors.bg.glass,
          borderColor: colors.border.default,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Icon size={17} color={colors.icon.secondary} />
      <Text style={[styles.profileRowLabel, { color: colors.text.primary }]}>
        {label}
      </Text>
      {trail && (
        <Text style={[styles.profileRowTrail, { color: colors.text.tertiary }]}>
          {trail}
        </Text>
      )}
      <ChevronRight size={16} color={colors.icon.secondary} />
    </Pressable>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 20,
  },

  // User card
  userCard: { marginBottom: 8, padding: 0 },
  userRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarWrap: { position: "relative" },
  cameraBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: "600", marginBottom: 2 },
  userDetail: { fontSize: 12, marginTop: 1 },

  // Sections
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 2,
  },
  sectionRows: { gap: 6 },

  // Bank cards
  bankCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
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
    fontWeight: "600",
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
  },
  defaultBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "600" },
  addBankBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  addBankText: { fontSize: 14, fontWeight: "500" },

  // Profile rows
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
  },
  profileRowLabel: { flex: 1, fontSize: 14 },
  profileRowTrail: { fontSize: 12 },

  // Sign out
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  signOutText: { fontSize: 15, fontWeight: "500" },
  versionText: { textAlign: "center", fontSize: 10, marginTop: 12 },
});
