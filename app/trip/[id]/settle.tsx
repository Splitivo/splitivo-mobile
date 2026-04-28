import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../../../src/presentation/components/Text";
import { ScreenContainer } from "../../../src/presentation/components/ScreenContainer";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../src/core/theme";
import { useTripStore } from "../../../src/presentation/stores/useTripStore";
import { GlassCard } from "../../../src/presentation/components/GlassCard";
import { Button } from "../../../src/presentation/components/Button";
import { Avatar } from "../../../src/presentation/components/Avatar";
import { ArrowRight, Check, CheckCircle } from "lucide-react-native";
import type { OptimizedTransfer } from "../../../src/domain/entities/trip";

export default function SettleScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, fetchTrips, getOptimizedTransfers } = useTripStore();
  const [transfers, setTransfers] = useState<OptimizedTransfer[]>([]);
  const [settled, setSettled] = useState<Set<number>>(new Set());

  const trip = trips.find((t) => t.id === id);

  useEffect(() => {
    const load = async () => {
      await fetchTrips();
      if (id) {
        const result = await getOptimizedTransfers(id);
        setTransfers(result.transfers);
      }
    };
    load();
  }, [id]);

  const toggleSettle = (idx: number) => {
    setSettled((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allSettled = transfers.length > 0 && settled.size === transfers.length;

  return (
    <ScreenContainer
      title="Settlement Tracker"
      navBarLeading={{ type: "backButton" }}
      isLargeTitle={false}
    >
      <Text style={{ color: colors.text.secondary, marginBottom: 20 }}>
        {trip?.name || "Trip"}
      </Text>

      {transfers.map((t, idx) => {
        const done = settled.has(idx);
        return (
          <GlassCard
            key={idx}
            style={styles.card}
            onPress={() => toggleSettle(idx)}
          >
            <View style={styles.row}>
              <Pressable
                onPress={() => toggleSettle(idx)}
                style={[
                  styles.checkbox,
                  {
                    borderColor: done
                      ? colors.status.success
                      : colors.border.default,
                    backgroundColor: done
                      ? colors.status.success
                      : "transparent",
                  },
                ]}
              >
                {done && <Check size={16} color="#fff" />}
              </Pressable>
              <Avatar name={t.fromName} size={32} />
              <ArrowRight size={14} color={colors.text.tertiary} />
              <Avatar name={t.toName} size={32} />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text
                  style={{
                    color: colors.text.primary,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {t.fromName} → {t.toName}
                </Text>
              </View>
              <Text
                style={{
                  color: done ? colors.status.success : colors.accent.primary,
                  fontWeight: "700",
                  fontSize: 16,
                  textDecorationLine: done ? "line-through" : "none",
                }}
              >
                ${t.amount.toFixed(2)}
              </Text>
            </View>
          </GlassCard>
        );
      })}

      {allSettled && (
        <View style={styles.doneBox}>
          <CheckCircle size={48} color={colors.status.success} />
          <Text style={[styles.doneText, { color: colors.status.success }]}>
            All Settled! 🎉
          </Text>
        </View>
      )}

      <Button
        title="Done"
        onPress={() => router.back()}
        fullWidth
        style={{ marginTop: 20, marginBottom: 32 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "700" },
  card: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBox: { alignItems: "center", marginTop: 24 },
  doneText: { fontSize: 20, fontWeight: "700", marginTop: 8 },
});
