import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useBillStore } from "../../src/presentation/stores/useBillStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Avatar } from "../../src/presentation/components/Avatar";
import { StatusPill } from "../../src/presentation/components/StatusPill";
import {
  Skeleton,
  CardSkeleton,
} from "../../src/presentation/components/Skeleton";
import type { Bill, PersonBreakdown } from "../../src/domain/entities/bill";
import { formatCurrency, formatDate } from "../../src/data/utils/currency";

export default function ResultScreen() {
  const { colors } = useTheme();
  const { billId } = useLocalSearchParams<{ billId: string }>();
  const { bills, fetchBills, fetchBreakdown, breakdown, settlePerson } =
    useBillStore();
  const [loading, setLoading] = useState(true);

  const bill = bills.find((b) => b.id === billId);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBills();
      if (billId) {
        await fetchBreakdown(billId);
      }
      setLoading(false);
    };
    load();
  }, [billId]);

  if (loading) {
    return (
      <ScreenContainer
        title="Split Bill Detail"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <Skeleton width="60%" height={28} />
        <CardSkeleton />
        <CardSkeleton />
      </ScreenContainer>
    );
  }

  if (!bill) {
    return (
      <ScreenContainer
        title="Split Bill Detail"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ color: colors.text.secondary, fontSize: 16 }}>
            Bill not found
          </Text>
          <Button
            title="Go Home"
            onPress={() => router.replace("/(tabs)")}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  const handleSettle = async (personId: string) => {
    await settlePerson(bill.id, personId);
    await fetchBreakdown(bill.id);
  };

  return (
    <ScreenContainer
      title={bill.merchantName}
      navBarTitle="Split Bill Detail"
      navBarLeading={{ type: "backButton" }}
    >
      {/* Bill header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <StatusPill status={bill.status} />
          <Text style={[styles.date, { color: colors.text.secondary }]}>
            {formatDate(bill.date)}
          </Text>
        </View>
      </View>

      {/* Total */}
      <GlassCard style={styles.totalCard}>
        <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>
          Grand Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.text.primary }]}>
          {formatCurrency(bill.totalAmount, bill.currency)}
        </Text>
        <View style={styles.totalMeta}>
          <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
            {`Tax: ${formatCurrency(bill.tax, bill.currency)} · Svc: ${formatCurrency(bill.serviceCharge, bill.currency)}`}
            {bill.discount > 0
              ? ` · Disc: -${formatCurrency(bill.discount, bill.currency)}`
              : ""}
          </Text>
        </View>
      </GlassCard>

      {/* Per-person breakdown */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Who Owes What
      </Text>
      {breakdown.map((person) => {
        const participant = bill.participants.find(
          (p) => p.id === person.participantId,
        );
        const name = participant
          ? participant.isGuest
            ? participant.name
            : participant.displayName
          : person.participantId;
        return (
          <GlassCard key={person.participantId} style={styles.personCard}>
            <View style={styles.personHeader}>
              <Avatar name={name} size={40} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.personName, { color: colors.text.primary }]}
                >
                  {name}
                </Text>
              </View>
              <Text
                style={[styles.personTotal, { color: colors.accent.primary }]}
              >
                {formatCurrency(person.amount, bill.currency)}
              </Text>
            </View>

            {!person.isPaid && (
              <Button
                title="Mark Settled"
                variant="secondary"
                size="sm"
                onPress={() => handleSettle(person.participantId)}
                fullWidth
                style={{ marginTop: 8 }}
              />
            )}
            {person.isPaid && <StatusPill status="settled" />}
          </GlassCard>
        );
      })}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Share Summary"
          variant="secondary"
          onPress={() => {
            // TODO: Share action
          }}
          fullWidth
        />
        <Button
          title="Done"
          onPress={() => router.replace("/(tabs)")}
          fullWidth
          style={{ marginTop: 8, marginBottom: 32 }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  date: { fontSize: 13 },
  totalCard: { alignItems: "center", marginBottom: 20 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 32, fontWeight: "800", marginTop: 4 },
  totalMeta: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  personCard: { marginBottom: 12 },
  personHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  personName: { fontSize: 15, fontWeight: "600" },
  personTotal: { fontSize: 18, fontWeight: "700" },
  itemRow: { flexDirection: "row", borderTopWidth: 0.5, paddingVertical: 6 },
  actions: { marginTop: 16 },
});
