import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme, CATEGORY_META } from "../../src/core/theme";
import { useUserStore } from "../../src/presentation/stores/useUserStore";
import { useTripStore } from "../../src/presentation/stores/useTripStore";
import { useBillStore } from "../../src/presentation/stores/useBillStore";
import { useCurrencyStore } from "../../src/presentation/stores/useCurrencyStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import {
  Avatar,
  StackedAvatars,
} from "../../src/presentation/components/Avatar";
import { StatusPill } from "../../src/presentation/components/StatusPill";
import {
  CardSkeleton,
  ListRowSkeleton,
} from "../../src/presentation/components/Skeleton";
import { Camera, PenLine, ChevronRight } from "lucide-react-native";
import {
  CategoryIcon,
  TripIcon,
} from "../../src/presentation/components/CategoryIcon";
import type { ExpenseCategory } from "../../src/domain/entities/expense";
import type { Bill } from "../../src/domain/entities/bill";
import type { Trip } from "../../src/domain/entities/trip";
import { formatCurrency, formatDate } from "../../src/data/utils/currency";
import { useLiquidGlass } from "../../src/hooks/useLiquidGlass";
import { GlassView } from "expo-glass-effect";

function getHourGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export default function HomeScreen() {
  const { colors, resolvedMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedCurrency } = useCurrencyStore();
  const { user, isLoading: userLoading, fetchUser } = useUserStore();
  const { trips, isLoading: tripsLoading, fetchTrips } = useTripStore();
  const { bills, isLoading: billsLoading, fetchBills } = useBillStore();

  useEffect(() => {
    fetchUser();
    fetchTrips();
    fetchBills();
  }, []);

  const isLoading = userLoading || tripsLoading || billsLoading;
  const singleBills = bills.filter((b) => !b.tripId).slice(0, 5);
  const activeTrips = trips.filter((t) => t.status === "active");

  const totalOwed = bills
    .filter((b) => b.status === "pending")
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Avatar name={user?.displayName ?? "U"} size={42} />
            <View style={styles.headerText}>
              <Text
                style={[styles.greetingLabel, { color: colors.text.tertiary }]}
              >
                {getHourGreeting()}
              </Text>
              <Text
                style={[styles.greetingName, { color: colors.text.primary }]}
              >
                Hey,{" "}
                {isLoading
                  ? "..."
                  : (user?.displayName?.split(" ")[0] ?? "there")}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Balance card ── */}
        <BalanceCard
          bills={bills}
          totalOwed={totalOwed}
          colors={colors}
          currency={selectedCurrency?.code ?? "IDR"}
        />

        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          <QuickActionCard
            icon={Camera}
            label="Scan Receipt"
            sub="OCR your bill"
            onPress={() => router.push("/split/scan")}
            accentColor={colors.accent.primary}
            textPrimary={colors.text.primary}
            textTertiary={colors.text.tertiary}
          />
          <QuickActionCard
            icon={PenLine}
            label="Manual Entry"
            sub="Type it in"
            onPress={() => router.push("/split/manual-entry")}
            accentColor={colors.accent.primary}
            textPrimary={colors.text.primary}
            textTertiary={colors.text.tertiary}
          />
        </View>

        {/* ── Active Trips ── */}
        <SectionHeader
          title="Active Trips"
          action="See all"
          onAction={() => router.push("/trip/create")}
          textPrimary={colors.text.primary}
          accentColor={colors.accent.primary}
        />
        <ActiveTripsSection
          activeTrips={activeTrips}
          isLoading={isLoading}
          colors={colors}
        />

        {/* ── Recent Bills ── */}
        <SectionHeader
          title="Recent Bills"
          action="See all"
          onAction={() => router.push("/(tabs)/activity")}
          textPrimary={colors.text.primary}
          accentColor={colors.accent.primary}
        />
        <RecentBillsSection
          singleBills={singleBills}
          isLoading={isLoading}
          colors={colors}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Currency button - sticky top right */}
      <View style={[styles.currencyFloating, { top: insets.top + 8 }]}>
        <CurrencyButton
          selectedCurrency={selectedCurrency}
          colors={colors}
          resolvedMode={resolvedMode}
        />
      </View>
    </ScreenContainer>
  );
}

// ── Sub-components ──────────────────────────────────────────

type Colors = ReturnType<typeof useTheme>["colors"];

function CurrencyButton({
  selectedCurrency,
  colors,
  resolvedMode,
}: {
  selectedCurrency: any;
  colors: Colors;
  resolvedMode: "light" | "dark";
}) {
  const isLiquidGlass = useLiquidGlass();

  return isLiquidGlass ? (
    <GlassView glassEffectStyle="clear" style={styles.currencyBtn}>
      <Pressable
        onPress={() => router.push("/currency-selection-sheet")}
        style={styles.currencyBtnInner}
      >
        <Text style={[styles.currencySymbol, { color: colors.accent.primary }]}>
          {selectedCurrency?.symbol ?? "$"}
        </Text>
        <Text
          style={[
            styles.currencyCode,
            {
              color:
                resolvedMode === "dark" ? "#FFFFFF" : colors.text.secondary,
            },
          ]}
        >
          {selectedCurrency?.code ?? "USD"}
        </Text>
      </Pressable>
    </GlassView>
  ) : (
    <Pressable
      onPress={() => router.push("/currency-selection-sheet")}
      style={styles.currencyBtn}
    >
      <Text style={[styles.currencySymbol, { color: colors.accent.primary }]}>
        {selectedCurrency?.symbol ?? "$"}
      </Text>
      <Text
        style={[
          styles.currencyCode,
          {
            color: resolvedMode === "dark" ? "#FFFFFF" : colors.text.secondary,
          },
        ]}
      >
        {selectedCurrency?.code ?? "USD"}
      </Text>
    </Pressable>
  );
}

function BalanceCard({
  bills,
  totalOwed,
  colors,
  currency,
}: {
  bills: Bill[];
  totalOwed: number;
  colors: Colors;
  currency: string;
}) {
  return (
    <GlassCard strong style={styles.balanceCard}>
      <View
        style={[styles.glowOrb, { backgroundColor: colors.accent.primary }]}
      />
      <Text style={[styles.balanceLabel, { color: colors.text.secondary }]}>
        TOTAL PENDING
      </Text>
      <Text style={[styles.balanceAmount, { color: colors.text.primary }]}>
        {(() => {
          const formatted = formatCurrency(totalOwed, currency, 2);
          const dotIndex = formatted.lastIndexOf(".");
          if (dotIndex === -1) return formatted;
          return (
            <>
              {formatted.slice(0, dotIndex)}
              <Text
                style={[styles.balanceCents, { color: colors.text.tertiary }]}
              >
                {formatted.slice(dotIndex)}
              </Text>
            </>
          );
        })()}
      </Text>
      <View style={styles.balanceDots}>
        <View style={styles.dotRow}>
          <View
            style={[styles.dot, { backgroundColor: colors.status.success }]}
          />
          <Text style={[styles.dotLabel, { color: colors.text.secondary }]}>
            {bills.filter((b) => b.status === "settled").length} settled
          </Text>
        </View>
        <View style={styles.dotRow}>
          <View
            style={[styles.dot, { backgroundColor: colors.status.warning }]}
          />
          <Text style={[styles.dotLabel, { color: colors.text.secondary }]}>
            {bills.filter((b) => b.status === "pending").length} pending
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

function TripCard({ trip, colors }: { trip: Trip; colors: Colors }) {
  return (
    <GlassCard style={styles.tripCardInner}>
      <View style={styles.tripCardTop}>
        <View style={styles.tripIconWrap}>
          <TripIcon size={20} color={colors.accent.primary} />
        </View>
        <View
          style={[
            styles.billsBadge,
            { backgroundColor: hexWithAlpha(colors.accent.primary, 0.15) },
          ]}
        >
          <Text
            style={[styles.billsBadgeText, { color: colors.accent.primary }]}
          >
            {trip.bills.length} bills
          </Text>
        </View>
      </View>
      <Text style={[styles.tripName, { color: colors.text.primary }]}>
        {trip.name}
      </Text>
      <Text style={[styles.tripDates, { color: colors.text.tertiary }]}>
        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
      </Text>
      <View style={styles.tripMeta}>
        <StackedAvatars
          names={trip.participants.map((p) =>
            p.isGuest ? p.name : p.displayName,
          )}
        />
        <Text style={[styles.tripAmount, { color: colors.text.primary }]}>
          {formatCurrency(trip.totalSpend, trip.currency)}
        </Text>
      </View>
    </GlassCard>
  );
}

function ActiveTripsSection({
  activeTrips,
  isLoading,
  colors,
}: {
  activeTrips: Trip[];
  isLoading: boolean;
  colors: Colors;
}) {
  if (isLoading) return <CardSkeleton />;
  if (activeTrips.length === 0) {
    return (
      <GlassCard>
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          No active trips yet.
        </Text>
      </GlassCard>
    );
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tripScroll}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
      snapToInterval={232}
      snapToAlignment="start"
      decelerationRate="fast"
    >
      {activeTrips.map((trip) => (
        <Pressable
          key={trip.id}
          onPress={() => router.push(`/trip/${trip.id}`)}
          style={({ pressed }) => [
            styles.tripCard,
            {
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <TripCard trip={trip} colors={colors} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function BillRow({ bill, colors }: { bill: Bill; colors: Colors }) {
  const catKey = bill.category;
  const meta = catKey && CATEGORY_META[catKey];
  return (
    <Pressable
      onPress={() => router.push(`/split/result?billId=${bill.id}`)}
      style={({ pressed }) => [
        styles.billRow,
        {
          backgroundColor: colors.bg.glass,
          borderColor: colors.border.default,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor: meta
              ? hexWithAlpha(meta.color, 0.22)
              : hexWithAlpha(colors.accent.primary, 0.15),
          },
        ]}
      >
        <CategoryIcon
          category={bill.category}
          size={20}
          color={meta?.color ?? colors.accent.primary}
        />
      </View>
      <View style={styles.billInfo}>
        <Text
          style={[styles.billMerchant, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {bill.merchantName}
        </Text>
        <Text style={[styles.billDate, { color: colors.text.tertiary }]}>
          {formatDate(bill.date)} · {bill.participants.length} people
        </Text>
      </View>
      <View style={styles.billRight}>
        <Text style={[styles.billAmount, { color: colors.text.primary }]}>
          {formatCurrency(bill.totalAmount, bill.currency)}
        </Text>
        <StatusPill status={bill.status} />
      </View>
    </Pressable>
  );
}

function RecentBillsSection({
  singleBills,
  isLoading,
  colors,
}: {
  singleBills: Bill[];
  isLoading: boolean;
  colors: Colors;
}) {
  if (isLoading)
    return (
      <>
        <ListRowSkeleton />
        <ListRowSkeleton />
      </>
    );
  if (singleBills.length === 0)
    return (
      <GlassCard>
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          No bills yet. Split one!
        </Text>
      </GlassCard>
    );
  return (
    <View style={styles.billsList}>
      {singleBills.map((bill) => (
        <BillRow key={bill.id} bill={bill} colors={colors} />
      ))}
    </View>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  sub,
  onPress,
  accentColor,
  textPrimary,
  textTertiary,
}: {
  icon: typeof Camera;
  label: string;
  sub: string;
  onPress: () => void;
  accentColor: string;
  textPrimary: string;
  textTertiary: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickActionWrapper,
        {
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <GlassCard style={styles.quickActionCard}>
        <View
          style={[
            styles.quickActionIconBg,
            { backgroundColor: hexWithAlpha(accentColor, 0.15) },
          ]}
        >
          <Icon size={20} color={accentColor} />
        </View>
        <Text style={[styles.quickActionLabel, { color: textPrimary }]}>
          {label}
        </Text>
        <Text style={[styles.quickActionSub, { color: textTertiary }]}>
          {sub}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
  textPrimary,
  accentColor,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  textPrimary: string;
  accentColor: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} style={styles.seeAllBtn}>
          <Text style={[styles.seeAllText, { color: accentColor }]}>
            {action}
          </Text>
          <ChevronRight size={12} color={accentColor} />
        </Pressable>
      )}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 100,
  },
  currencyFloating: {
    position: "absolute",
    right: 20,
    zIndex: 100,
  },
  currencyBtn: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 6,
    overflow: "hidden",
  },
  currencyBtnInner: {
    paddingHorizontal: 10,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerText: {},
  greetingLabel: { fontSize: 11, marginBottom: 1 },
  greetingName: { fontSize: 17, fontWeight: "600", letterSpacing: -0.3 },
  currencySymbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  currencyCode: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Balance card
  balanceCard: { marginBottom: 20, overflow: "hidden" },
  glowOrb: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.25,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  balanceAmount: { fontSize: 40, fontWeight: "700", letterSpacing: -1 },
  balanceCents: { fontSize: 24, fontWeight: "400" },
  balanceDots: { flexDirection: "row", gap: 16, marginTop: 16 },
  dotRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotLabel: { fontSize: 13 },

  // Quick actions
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  quickActionWrapper: { flex: 1 },
  quickActionCard: { padding: 0 },
  quickActionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickActionLabel: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  quickActionSub: { fontSize: 12 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", letterSpacing: -0.2 },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 12 },

  // Trips
  tripScroll: { marginBottom: 20, marginHorizontal: -20, marginVertical: -8 },
  tripCard: { marginRight: 12 },
  tripCardInner: { width: 220, padding: 0 },
  tripCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tripEmoji: { fontSize: 30 },
  tripIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 4,
    paddingLeft: 4,
  },
  billsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  billsBadgeText: { fontSize: 10, fontWeight: "600" },
  tripName: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  tripDates: { fontSize: 11, marginBottom: 12 },
  tripMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripAmount: { fontSize: 14, fontWeight: "700" },

  // Bills
  billsList: { gap: 8, marginBottom: 8 },
  billRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmoji: { fontSize: 20 },
  billInfo: { flex: 1, minWidth: 0 },
  billMerchant: { fontSize: 15, fontWeight: "500", marginBottom: 2 },
  billDate: { fontSize: 11 },
  billRight: { alignItems: "flex-end", gap: 4 },
  billAmount: { fontSize: 15, fontWeight: "600" },
  emptyText: { textAlign: "center", fontSize: 14, paddingVertical: 8 },
});
