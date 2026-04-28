import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../../../src/presentation/components/Text";
import { ScreenContainer } from "../../../src/presentation/components/ScreenContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../src/core/theme";
import { useTripStore } from "../../../src/presentation/stores/useTripStore";
import { GlassCard } from "../../../src/presentation/components/GlassCard";
import { Button } from "../../../src/presentation/components/Button";
import {
  Avatar,
  StackedAvatars,
} from "../../../src/presentation/components/Avatar";
import { StatusPill } from "../../../src/presentation/components/StatusPill";
import {
  Skeleton,
  CardSkeleton,
} from "../../../src/presentation/components/Skeleton";
import { ArrowRight } from "lucide-react-native";
import { formatCurrency, formatDate } from "../../../src/data/utils/currency";
import type { OptimizedTransfer } from "../../../src/domain/entities/trip";

export default function TripDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    trips,
    fetchTrips,
    fetchOptimizedTransfers,
    transfers: storeTransfers,
  } = useTripStore();
  const transfers = storeTransfers?.transfers ?? [];
  const [loading, setLoading] = useState(true);

  const trip = trips.find((t) => t.id === id);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchTrips();
      if (id) {
        await fetchOptimizedTransfers(id);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer
        title="Trip Detail"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <Skeleton width="60%" height={28} />
        <CardSkeleton />
        <CardSkeleton />
      </ScreenContainer>
    );
  }

  if (!trip) {
    return (
      <ScreenContainer
        title="Trip Detail"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ color: colors.text.secondary }}>Trip not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScreenContainer>
    );
  }

  const participantNames = trip.participants.map((p) =>
    p.isGuest ? p.name : p.displayName,
  );

  return (
    <ScreenContainer
      title={trip.name}
      navBarTitle="Trip Detail"
      navBarLeading={{ type: "backButton" }}
    >
      {/* Trip meta */}
      <View style={styles.headerMeta}>
        <StatusPill status={trip.status === "active" ? "pending" : "settled"} />
        <Text style={{ color: colors.text.secondary, fontSize: 13 }}>
          {formatDate(trip.startDate)} —{" "}
          {trip.endDate ? formatDate(trip.endDate) : "Ongoing"}
        </Text>
      </View>

      {/* Participants */}
      <GlassCard>
        <Text style={[styles.sectionLabel, { color: colors.text.primary }]}>
          {trip.participants.length} Participants
        </Text>
        <StackedAvatars names={participantNames} max={6} size={36} />
      </GlassCard>

      {/* Bills */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Bills
        </Text>
        <Button
          title="+ Add Bill"
          size="sm"
          variant="secondary"
          onPress={() => router.push(`/trip/${id}/add-bill`)}
        />
      </View>

      {trip.bills.length === 0 && (
        <Text
          style={{
            color: colors.text.tertiary,
            textAlign: "center",
            paddingVertical: 20,
          }}
        >
          No bills yet. Add one!
        </Text>
      )}

      {trip.bills.map((bill) => (
        <GlassCard key={bill.id} style={styles.billCard}>
          <View style={styles.billRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.billMerchant, { color: colors.text.primary }]}
              >
                {bill.merchantName}
              </Text>
              <Text style={{ color: colors.text.secondary, fontSize: 12 }}>
                {formatDate(bill.date)} · {bill.items.length} items
              </Text>
            </View>
            <Text style={[styles.billAmount, { color: colors.accent.primary }]}>
              {formatCurrency(bill.totalAmount, bill.currency)}
            </Text>
          </View>
        </GlassCard>
      ))}

      {/* Optimized Transfers */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text.primary, marginTop: 20 },
        ]}
      >
        Optimized Transfers
      </Text>
      <Text
        style={{
          color: colors.text.tertiary,
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        Minimum transactions to settle all debts
      </Text>

      {transfers.length === 0 && (
        <Text
          style={{
            color: colors.text.tertiary,
            textAlign: "center",
            paddingVertical: 12,
          }}
        >
          Add bills to see optimized transfers.
        </Text>
      )}

      {transfers.map((t, idx) => (
        <GlassCard key={idx} style={styles.transferCard}>
          <View style={styles.transferRow}>
            <Avatar
              name={t.from.isGuest ? t.from.name : t.from.displayName}
              size={32}
            />
            <ArrowRight size={16} color={colors.text.tertiary} />
            <Avatar
              name={t.to.isGuest ? t.to.name : t.to.displayName}
              size={32}
            />
            <Text
              style={[styles.transferAmount, { color: colors.accent.primary }]}
            >
              {formatCurrency(t.amount, trip.currency)}
            </Text>
          </View>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {t.from.isGuest ? t.from.name : t.from.displayName} →{" "}
            {t.to.isGuest ? t.to.name : t.to.displayName}
          </Text>
        </GlassCard>
      ))}

      {/* Actions */}
      <Button
        title="Settlement Tracker"
        variant="secondary"
        onPress={() => router.push(`/trip/${id}/settle`)}
        fullWidth
        style={{ marginTop: 16 }}
      />
      <Button
        title="Share Summary"
        variant="ghost"
        onPress={() => {}}
        fullWidth
        style={{ marginTop: 8, marginBottom: 32 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  billCard: { marginBottom: 8 },
  billRow: { flexDirection: "row", alignItems: "center" },
  billMerchant: { fontSize: 15, fontWeight: "600" },
  billAmount: { fontSize: 16, fontWeight: "700" },
  transferCard: { marginBottom: 8 },
  transferRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  transferAmount: { fontSize: 16, fontWeight: "700", marginLeft: "auto" },
});
