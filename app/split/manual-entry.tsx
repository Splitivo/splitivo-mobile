import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useBillStore } from "../../src/presentation/stores/useBillStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Input } from "../../src/presentation/components/Input";
import { BillItem } from "../../src/domain/entities/bill";

export default function ManualEntryScreen() {
  const { colors } = useTheme();
  const {
    draftMerchant,
    draftDate,
    draftItems,
    draftTax,
    draftServiceCharge,
    draftDiscount,
    setDraftMerchant,
    setDraftDate,
    addDraftItem,
    removeDraftItem,
    updateDraftItem,
    setDraftTax,
    setDraftServiceCharge,
    setDraftDiscount,
  } = useBillStore();

  const addNewItem = () => {
    const item: BillItem = {
      id: `item_${Date.now()}`,
      name: "",
      quantity: 1,
      unitPrice: 0,
      assignedTo: [],
    };
    addDraftItem(item);
  };

  const itemsTotal = draftItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const grandTotal = itemsTotal + draftTax + draftServiceCharge - draftDiscount;

  return (
    <ScreenContainer
      title="Manual Entry"
      navBarLeading={{ type: "backButton" }}
      isLargeTitle={false}
    >
      <Input
        label="Merchant / Store name"
        placeholder="e.g., Pizza Palace"
        value={draftMerchant}
        onChangeText={setDraftMerchant}
      />

      <Input
        label="Date"
        placeholder="YYYY-MM-DD"
        value={draftDate}
        onChangeText={setDraftDate}
      />

      {/* Items */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Items
      </Text>
      {draftItems.map((item, index) => (
        <GlassCard key={item.id} style={styles.itemCard}>
          <Input
            placeholder="Item name"
            value={item.name}
            onChangeText={(text) => updateDraftItem(item.id, { name: text })}
          />
          <View style={styles.itemRow}>
            <View style={styles.itemField}>
              <Input
                label="Qty"
                placeholder="1"
                value={item.quantity.toString()}
                onChangeText={(text) =>
                  updateDraftItem(item.id, { quantity: parseInt(text) || 0 })
                }
                keyboardType="numeric"
              />
            </View>
            <View style={styles.itemField}>
              <Input
                label="Price"
                placeholder="0.00"
                value={item.unitPrice > 0 ? item.unitPrice.toString() : ""}
                onChangeText={(text) =>
                  updateDraftItem(item.id, {
                    unitPrice: parseFloat(text) || 0,
                  })
                }
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.lineTotal}>
              <Text
                style={[
                  styles.lineTotalLabel,
                  { color: colors.text.secondary },
                ]}
              >
                Total
              </Text>
              <Text
                style={[styles.lineTotalValue, { color: colors.text.primary }]}
              >
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => removeDraftItem(item.id)}>
            <Text
              style={[styles.removeText, { color: colors.text.destructive }]}
            >
              Remove
            </Text>
          </Pressable>
        </GlassCard>
      ))}

      <Button
        title="+ Add Item"
        variant="secondary"
        onPress={addNewItem}
        fullWidth
      />

      {/* Additional Charges */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        Additional Charges
      </Text>
      <View style={styles.chargesRow}>
        <View style={styles.chargeField}>
          <Input
            label="Tax"
            placeholder="0.00"
            value={draftTax > 0 ? draftTax.toString() : ""}
            onChangeText={(text) => setDraftTax(parseFloat(text) || 0)}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.chargeField}>
          <Input
            label="Service"
            placeholder="0.00"
            value={draftServiceCharge > 0 ? draftServiceCharge.toString() : ""}
            onChangeText={(text) =>
              setDraftServiceCharge(parseFloat(text) || 0)
            }
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.chargeField}>
          <Input
            label="Discount"
            placeholder="0.00"
            value={draftDiscount > 0 ? draftDiscount.toString() : ""}
            onChangeText={(text) => setDraftDiscount(parseFloat(text) || 0)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {/* Grand Total */}
      <GlassCard style={styles.totalCard}>
        <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>
          Grand Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.text.primary }]}>
          ${grandTotal.toFixed(2)}
        </Text>
      </GlassCard>

      <Button
        title="Continue"
        onPress={() => router.push("/split/confirm")}
        fullWidth
        size="lg"
        style={{ marginTop: 16, marginBottom: 32 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 12,
  },
  itemCard: { marginBottom: 12 },
  itemRow: { flexDirection: "row", gap: 8 },
  itemField: { flex: 1 },
  lineTotal: { alignItems: "center", justifyContent: "center", paddingTop: 20 },
  lineTotalLabel: { fontSize: 12 },
  lineTotalValue: { fontSize: 16, fontWeight: "700" },
  removeText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 4,
  },
  chargesRow: { flexDirection: "row", gap: 8 },
  chargeField: { flex: 1 },
  totalCard: { alignItems: "center", paddingVertical: 20 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 32, fontWeight: "800", marginTop: 4 },
});
