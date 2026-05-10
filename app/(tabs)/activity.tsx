import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { router } from "expo-router";
import { useTheme, CATEGORY_META } from "../../src/core/theme";
import { useBillStore } from "../../src/presentation/stores/useBillStore";
import { StackedAvatars } from "../../src/presentation/components/Avatar";
import { StatusPill } from "../../src/presentation/components/StatusPill";
import { ListRowSkeleton } from "../../src/presentation/components/Skeleton";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import type { ExpenseCategory } from "../../src/domain/entities/expense";
import type { Bill } from "../../src/domain/entities/bill";
import { CategoryIcon } from "../../src/presentation/components/CategoryIcon";
import { formatCurrency, formatDate } from "../../src/data/utils/currency";

type FilterType = "all" | "single" | "trips" | "pending" | "settled";
const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "single", label: "Single" },
  { key: "trips", label: "Trips" },
  { key: "pending", label: "Pending" },
  { key: "settled", label: "Settled" },
];

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export default function ActivityScreen() {
  const { colors } = useTheme();
  const { bills, isLoading, fetchBills } = useBillStore();
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((bill) => {
    switch (filter) {
      case "single":
        return !bill.tripId;
      case "trips":
        return !!bill.tripId;
      case "pending":
        return bill.status === "pending";
      case "settled":
        return bill.status === "settled";
      default:
        return true;
    }
  });

  const sortedBills = [...filteredBills].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <ScreenContainer
      title="Activity"
      subtitle="All your splits in one place"
      hasTabBar
    >
      {/* Filter chips — scrollable, rounded-full */}
      <FilterChips filter={filter} onSelect={setFilter} colors={colors} />

      {/* Bills list */}
      <BillsList
        sortedBills={sortedBills}
        isLoading={isLoading}
        colors={colors}
      />
    </ScreenContainer>
  );
}

// ── Sub-components ──────────────────────────────────────────

type Colors = ReturnType<typeof useTheme>["colors"];

function FilterChips({
  filter,
  onSelect,
  colors,
}: {
  filter: FilterType;
  onSelect: (key: FilterType) => void;
  colors: Colors;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScroll}
      contentContainerStyle={styles.filterRow}
    >
      {FILTERS.map(({ key, label }) => (
        <Pressable
          key={key}
          onPress={() => onSelect(key)}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                filter === key ? colors.accent.primary : colors.bg.glass,
              borderColor: colors.border.default,
            },
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              {
                color:
                  filter === key ? colors.text.onAccent : colors.text.secondary,
              },
            ]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function BillCard({ bill, colors }: { bill: Bill; colors: Colors }) {
  const catKey = bill.category;
  const meta = catKey && CATEGORY_META[catKey];
  const perPerson =
    bill.participants.length > 0
      ? bill.totalAmount / bill.participants.length
      : 0;
  return (
    <Pressable
      onPress={() =>
        bill.tripId
          ? router.push(`/trip/${bill.tripId}`)
          : router.push(`/split/${bill.id}`)
      }
      style={({ pressed }) => [
        styles.billCard,
        {
          backgroundColor: colors.bg.glass,
          borderColor: colors.border.default,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.billMain}>
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
            category={catKey}
            size={20}
            color={meta?.color ?? colors.accent.primary}
          />
        </View>
        <View style={styles.billInfo}>
          <View style={styles.billTitleRow}>
            <Text
              style={[styles.merchantName, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {bill.merchantName}
            </Text>
            {bill.tripId && (
              <View
                style={[
                  styles.tripBadge,
                  {
                    backgroundColor: hexWithAlpha(colors.accent.primary, 0.15),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tripBadgeText,
                    { color: colors.accent.primary },
                  ]}
                >
                  TRIP
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.billDate, { color: colors.text.tertiary }]}>
            {formatDate(bill.date)}
          </Text>
        </View>
        <View style={styles.billRight}>
          <Text style={[styles.billAmount, { color: colors.text.primary }]}>
            {formatCurrency(bill.totalAmount, bill.currency)}
          </Text>
          <StatusPill status={bill.status} />
        </View>
      </View>
      <View
        style={[styles.billFooter, { borderTopColor: colors.border.default }]}
      >
        <StackedAvatars
          names={bill.participants.map((p) =>
            p.isGuest ? p.name : p.displayName,
          )}
        />
        <Text style={[styles.perPerson, { color: colors.text.tertiary }]}>
          ${perPerson.toFixed(2)} / person
        </Text>
      </View>
    </Pressable>
  );
}

function BillsList({
  sortedBills,
  isLoading,
  colors,
}: {
  sortedBills: Bill[];
  isLoading: boolean;
  colors: Colors;
}) {
  if (isLoading)
    return (
      <>
        <ListRowSkeleton />
        <ListRowSkeleton />
        <ListRowSkeleton />
      </>
    );
  if (sortedBills.length === 0)
    return (
      <View
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.bg.glass,
            borderColor: colors.border.default,
          },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          No activity yet.
        </Text>
      </View>
    );
  return (
    <View style={styles.billsList}>
      {sortedBills.map((bill) => (
        <BillCard key={bill.id} bill={bill} colors={colors} />
      ))}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  header: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },

  // Filters
  filterScroll: { marginBottom: 20 },
  filterRow: { gap: 8, paddingRight: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 12, fontWeight: "600" },

  // Bills
  billsList: { gap: 10 },
  billCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  billMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
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
  billTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  merchantName: { fontSize: 15, fontWeight: "500", flex: 1 },
  tripBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tripBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  billDate: { fontSize: 11 },
  billRight: { alignItems: "flex-end", gap: 4 },
  billAmount: { fontSize: 15, fontWeight: "600" },

  // Footer
  billFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  perPerson: { fontSize: 11 },

  // Empty
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: { fontSize: 14 },
});
