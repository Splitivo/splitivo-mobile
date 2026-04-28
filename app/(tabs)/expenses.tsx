import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { useTheme, CATEGORY_META } from "../../src/core/theme";
import { useExpenseStore } from "../../src/presentation/stores/useExpenseStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import {
  CardSkeleton,
  SummaryCardSkeleton,
  ListRowSkeleton,
} from "../../src/presentation/components/Skeleton";
import type {
  ExpenseCategory,
  TimePeriod,
  Expense,
  CategoryBreakdown,
} from "../../src/domain/entities/expense";
import { SegmentedControl } from "../../src/presentation/components/SegmentedControl";
import { CategoryIcon } from "../../src/presentation/components/CategoryIcon";
import { formatCurrency, formatDate } from "../../src/data/utils/currency";

const PERIODS: TimePeriod[] = ["daily", "monthly", "annually"];
const PERIOD_LABELS: Record<TimePeriod, string> = {
  daily: "Daily",
  monthly: "Monthly",
  annually: "Annually",
};

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${a}`;
}

export default function ExpensesScreen() {
  const { colors, resolvedMode } = useTheme();
  const {
    expenses,
    categoryBreakdown,
    selectedPeriod,
    isLoading,
    setPeriod,
    fetchAll,
  } = useExpenseStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const total = categoryBreakdown.reduce((sum, c) => sum + c.amount, 0);

  return (
    <ScreenContainer title="Expenses" subtitle="Where your money goes">
      {/* Period Filter */}
      <SegmentedControl
        options={PERIODS}
        labels={PERIOD_LABELS}
        selected={selectedPeriod}
        onSelect={setPeriod}
        delay={600}
      />

      {/* Summary card */}
      {isLoading ? (
        <SummaryCardSkeleton />
      ) : (
        <SummaryCard
          total={total}
          selectedPeriod={selectedPeriod}
          categoryBreakdown={categoryBreakdown}
          colors={colors}
        />
      )}

      {/* Recent Transactions */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Recent transactions
      </Text>
      <TransactionList
        expenses={expenses}
        isLoading={isLoading}
        colors={colors}
      />
    </ScreenContainer>
  );
}

// ── Sub-components ──────────────────────────────────────────

type Colors = ReturnType<typeof useTheme>["colors"];

function BreakdownRow({
  cat,
  colors,
}: {
  cat: CategoryBreakdown;
  colors: Colors;
}) {
  const meta = CATEGORY_META[cat.category as ExpenseCategory];
  return (
    <View style={styles.breakdownRow}>
      <View
        style={[
          styles.categoryIconSm,
          {
            backgroundColor: meta
              ? hexWithAlpha(meta.color, 0.22)
              : hexWithAlpha(colors.accent.primary, 0.15),
          },
        ]}
      >
        <CategoryIcon
          category={cat.category as ExpenseCategory}
          size={18}
          color={meta?.color ?? colors.accent.primary}
        />
      </View>
      <View style={styles.breakdownContent}>
        <View style={styles.breakdownTop}>
          <Text style={[styles.breakdownName, { color: colors.text.primary }]}>
            {meta ? meta.label : cat.category}
          </Text>
          <Text
            style={[styles.breakdownAmount, { color: colors.text.primary }]}
          >
            ${cat.amount.toFixed(2)}
          </Text>
        </View>
        <View style={styles.breakdownBarRow}>
          <View
            style={[
              styles.barBg,
              {
                backgroundColor: hexWithAlpha(colors.text.tertiary, 0.15),
              },
            ]}
          >
            <View
              style={[
                styles.bar,
                {
                  width: `${cat.percentage}%`,
                  backgroundColor: meta ? meta.color : colors.accent.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.breakdownPct, { color: colors.text.tertiary }]}>
            {cat.percentage.toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function SummaryCard({
  total,
  selectedPeriod,
  categoryBreakdown,
  colors,
}: {
  total: number;
  selectedPeriod: TimePeriod;
  categoryBreakdown: CategoryBreakdown[];
  colors: Colors;
}) {
  return (
    <GlassCard strong style={styles.summaryCard}>
      <View
        style={[styles.glowOrb, { backgroundColor: colors.accent.primary }]}
      />
      <View style={styles.summaryCenter}>
        <Text style={[styles.summaryLabel, { color: colors.text.tertiary }]}>
          {PERIOD_LABELS[selectedPeriod]} total
        </Text>
        <Text style={[styles.summaryTotal, { color: colors.text.primary }]}>
          ${total.toFixed(0)}
        </Text>
      </View>
      <View style={styles.breakdownList}>
        {categoryBreakdown.map((cat) => (
          <BreakdownRow key={cat.category} cat={cat} colors={colors} />
        ))}
      </View>
    </GlassCard>
  );
}

function TransactionRow({ exp, colors }: { exp: Expense; colors: Colors }) {
  const meta = CATEGORY_META[exp.category as ExpenseCategory];
  return (
    <View style={styles.transactionRow}>
      <View
        style={[
          styles.categoryIconSm,
          {
            backgroundColor: meta
              ? hexWithAlpha(meta.color, 0.22)
              : hexWithAlpha(colors.accent.primary, 0.15),
          },
        ]}
      >
        <CategoryIcon
          category={exp.category as ExpenseCategory}
          size={18}
          color={meta?.color ?? colors.accent.primary}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text
          style={[styles.transactionName, { color: colors.text.primary }]}
          numberOfLines={1}
        >
          {exp.merchantName}
        </Text>
        <Text style={[styles.transactionDate, { color: colors.text.tertiary }]}>
          {formatDate(exp.date)} · {meta ? meta.label : exp.category}
        </Text>
      </View>
      <Text style={[styles.transactionAmount, { color: colors.text.primary }]}>
        {formatCurrency(exp.amount, exp.currency)}
      </Text>
    </View>
  );
}

function TransactionList({
  expenses,
  isLoading,
  colors,
}: {
  expenses: Expense[];
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
  return (
    <View style={styles.transactionList}>
      {expenses.map((exp) => (
        <TransactionRow key={exp.id} exp={exp} colors={colors} />
      ))}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Summary card
  summaryCard: { marginBottom: 24, overflow: "hidden" },
  glowOrb: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.2,
  },
  summaryCenter: { alignItems: "center", paddingVertical: 20 },
  summaryLabel: { fontSize: 12, marginBottom: 6 },
  summaryTotal: { fontSize: 42, fontWeight: "700", letterSpacing: -1 },

  // Breakdown
  breakdownList: { gap: 12 },
  breakdownRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  categoryIconSm: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryEmojiSm: { fontSize: 18 },
  breakdownContent: { flex: 1 },
  breakdownTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownName: { fontSize: 13, fontWeight: "500" },
  breakdownAmount: { fontSize: 13, fontWeight: "600" },
  breakdownBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: { height: "100%", borderRadius: 3 },
  breakdownPct: { fontSize: 10, width: 28, textAlign: "right" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 12,
  },

  // Transactions
  transactionList: { gap: 2 },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  transactionInfo: { flex: 1 },
  transactionName: { fontSize: 14, fontWeight: "500" },
  transactionDate: { fontSize: 11, marginTop: 1 },
  transactionAmount: { fontSize: 14, fontWeight: "600" },
});
