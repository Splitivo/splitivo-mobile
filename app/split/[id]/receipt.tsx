import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "../../../src/presentation/components/Text";
import { ScreenContainer } from "../../../src/presentation/components/ScreenContainer";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../src/core/theme";
import { useBillStore } from "../../../src/presentation/stores/useBillStore";
import { GlassCard } from "../../../src/presentation/components/GlassCard";
import {
  Skeleton,
  CardSkeleton,
} from "../../../src/presentation/components/Skeleton";
import type { BillItem } from "../../../src/domain/entities/bill";
import { formatCurrency } from "../../../src/data/utils/currency";

export default function ReceiptScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bills, fetchBills } = useBillStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchBills();
      setLoading(false);
    };
    load();
  }, [id]);

  const bill = bills.find((b) => b.id === id);

  if (loading) {
    return (
      <ScreenContainer
        title="Receipt"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <CardSkeleton />
        <CardSkeleton />
      </ScreenContainer>
    );
  }

  if (!bill) {
    return (
      <ScreenContainer
        title="Receipt"
        navBarLeading={{ type: "backButton" }}
        isLargeTitle={false}
      >
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ color: colors.text.secondary, fontSize: 16 }}>
            Bill not found
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const subtotal = bill.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <ScreenContainer
      title={bill.merchantName}
      navBarTitle="Receipt"
      navBarLeading={{ type: "backButton" }}
    >
      {/* Items */}
      <GlassCard style={styles.card}>
        {bill.items.map((item, index) => (
          <View key={item.id}>
            {index > 0 && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border.default },
                ]}
              />
            )}
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemName, { color: colors.text.primary }]}>
                  {item.name}
                </Text>
                {item.quantity > 1 && (
                  <Text
                    style={[styles.itemQty, { color: colors.text.tertiary }]}
                  >
                    {`${item.quantity} × ${formatCurrency(item.unitPrice, bill.currency)}`}
                  </Text>
                )}
              </View>
              <Text
                style={[styles.itemPrice, { color: colors.text.secondary }]}
              >
                {formatCurrency(item.unitPrice * item.quantity, bill.currency)}
              </Text>
            </View>
          </View>
        ))}
      </GlassCard>

      {/* Totals */}
      <GlassCard style={styles.card}>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
            Subtotal
          </Text>
          <Text style={{ color: colors.text.primary, fontSize: 14 }}>
            {formatCurrency(subtotal, bill.currency)}
          </Text>
        </View>
        {bill.tax > 0 && (
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              Tax
            </Text>
            <Text style={{ color: colors.text.primary, fontSize: 14 }}>
              {formatCurrency(bill.tax, bill.currency)}
            </Text>
          </View>
        )}
        {bill.serviceCharge > 0 && (
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              Service Charge
            </Text>
            <Text style={{ color: colors.text.primary, fontSize: 14 }}>
              {formatCurrency(bill.serviceCharge, bill.currency)}
            </Text>
          </View>
        )}
        {bill.discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              Discount
            </Text>
            <Text style={{ color: colors.status.success, fontSize: 14 }}>
              -{formatCurrency(bill.discount, bill.currency)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border.default, marginVertical: 10 },
          ]}
        />
        <View style={styles.summaryRow}>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Total
          </Text>
          <Text
            style={{
              color: colors.accent.primary,
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            {formatCurrency(bill.totalAmount, bill.currency)}
          </Text>
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemName: { fontSize: 15, fontWeight: "500" },
  itemQty: { fontSize: 12, marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: "500" },
  divider: { height: StyleSheet.hairlineWidth },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
});
