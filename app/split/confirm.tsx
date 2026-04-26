import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useBillStore } from "../../src/presentation/stores/useBillStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Avatar } from "../../src/presentation/components/Avatar";
import { formatCurrency } from "../../src/data/utils/currency";

export default function ConfirmScreen() {
  const { colors } = useTheme();
  const {
    draftItems,
    draftParticipants,
    draftMerchant,
    draftDate,
    draftCurrency,
    draftTax,
    draftServiceCharge,
    draftDiscount,
    updateDraftItem,
    addDraftParticipant,
    removeDraftParticipant,
  } = useBillStore();

  const itemsTotal = draftItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const grandTotal = itemsTotal + draftTax + draftServiceCharge - draftDiscount;

  // Calculate per-person subtotals
  const personTotals = new Map<string, number>();
  draftParticipants.forEach((p) => personTotals.set(p.id, 0));

  draftItems.forEach((item) => {
    if (item.assignedTo.length > 0) {
      const share = (item.quantity * item.unitPrice) / item.assignedTo.length;
      item.assignedTo.forEach((pid) => {
        personTotals.set(pid, (personTotals.get(pid) || 0) + share);
      });
    }
  });

  const sharedCosts = draftTax + draftServiceCharge - draftDiscount;
  if (draftParticipants.length > 0 && sharedCosts > 0) {
    const perPerson = sharedCosts / draftParticipants.length;
    draftParticipants.forEach((p) => {
      personTotals.set(p.id, (personTotals.get(p.id) || 0) + perPerson);
    });
  }

  const togglePersonForItem = (itemId: string, personId: string) => {
    const item = draftItems.find((i) => i.id === itemId);
    if (!item) return;

    const isAssigned = item.assignedTo.includes(personId);
    updateDraftItem(itemId, {
      assignedTo: isAssigned
        ? item.assignedTo.filter((id) => id !== personId)
        : [...item.assignedTo, personId],
    });
  };

  const handleConfirm = async () => {
    const bill = await useBillStore.getState().createBill();
    router.replace(`/split/result?billId=${bill.id}`);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg.primary }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {draftMerchant || "Confirm Bill"}
          </Text>
          <View style={styles.headerMeta}>
            <Text style={[styles.headerDate, { color: colors.text.secondary }]}>
              {draftDate}
            </Text>
            <View
              style={[
                styles.currencyBadge,
                { backgroundColor: colors.bg.container },
              ]}
            >
              <Text
                style={[styles.currencyText, { color: colors.text.primary }]}
              >
                {draftCurrency}
              </Text>
            </View>
          </View>
        </View>

        {/* Items */}
        {draftItems.map((item) => (
          <GlassCard key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemName, { color: colors.text.primary }]}>
                {item.name || "Unnamed item"}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.text.primary }]}>
                {formatCurrency(item.quantity * item.unitPrice, draftCurrency)}
              </Text>
            </View>
            <Text style={[styles.itemDetail, { color: colors.text.secondary }]}>
              {item.quantity} × {formatCurrency(item.unitPrice, draftCurrency)}
              {item.assignedTo.length > 1 && ` · ÷${item.assignedTo.length}`}
            </Text>

            {/* Person chips */}
            <View style={styles.personChips}>
              {draftParticipants.map((person) => {
                const isAssigned = item.assignedTo.includes(person.id);
                const name = person.isGuest ? person.name : person.displayName;
                return (
                  <Pressable
                    key={person.id}
                    onPress={() => togglePersonForItem(item.id, person.id)}
                    style={[
                      styles.personChip,
                      {
                        backgroundColor: isAssigned
                          ? colors.accent.primary + "30"
                          : colors.bg.input,
                        borderColor: isAssigned
                          ? colors.accent.primary
                          : colors.border.default,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.personChipText,
                        {
                          color: isAssigned
                            ? colors.accent.primary
                            : colors.text.secondary,
                        },
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
        ))}

        {/* Shared Costs */}
        <GlassCard style={styles.sharedCosts}>
          <Text style={[styles.sectionLabel, { color: colors.text.primary }]}>
            Shared Costs
          </Text>
          {draftTax > 0 && (
            <View style={styles.costRow}>
              <Text style={{ color: colors.text.secondary }}>Tax</Text>
              <Text style={{ color: colors.text.primary }}>
                {formatCurrency(draftTax, draftCurrency)}
              </Text>
            </View>
          )}
          {draftServiceCharge > 0 && (
            <View style={styles.costRow}>
              <Text style={{ color: colors.text.secondary }}>Service</Text>
              <Text style={{ color: colors.text.primary }}>
                {formatCurrency(draftServiceCharge, draftCurrency)}
              </Text>
            </View>
          )}
          {draftDiscount > 0 && (
            <View style={styles.costRow}>
              <Text style={{ color: colors.text.secondary }}>Discount</Text>
              <Text style={{ color: colors.status.success }}>
                -{formatCurrency(draftDiscount, draftCurrency)}
              </Text>
            </View>
          )}
        </GlassCard>

        {/* People */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          People
        </Text>
        {draftParticipants.map((person) => {
          const name = person.isGuest ? person.name : person.displayName;
          const total = personTotals.get(person.id) || 0;
          return (
            <View key={person.id} style={styles.personRow}>
              <Avatar name={name} size={36} />
              <Text style={[styles.personName, { color: colors.text.primary }]}>
                {name}
              </Text>
              <Text
                style={[styles.personAmount, { color: colors.accent.primary }]}
              >
                {formatCurrency(total, draftCurrency)}
              </Text>
            </View>
          );
        })}

        <Button
          title="+ Add Person"
          variant="secondary"
          onPress={() => {
            // Add a mock guest for now
            addDraftParticipant({
              id: `guest_${Date.now()}`,
              name: `Guest ${draftParticipants.length + 1}`,
              isGuest: true,
            });
          }}
          fullWidth
          style={{ marginTop: 8 }}
        />

        {/* Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.text.primary }]}>
            {formatCurrency(grandTotal, draftCurrency)}
          </Text>
        </GlassCard>

        <Button
          title="Confirm Split"
          onPress={handleConfirm}
          fullWidth
          size="lg"
          style={{ marginTop: 16, marginBottom: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700" },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  headerDate: { fontSize: 14 },
  currencyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  currencyText: { fontSize: 12, fontWeight: "600" },
  itemCard: { marginBottom: 10 },
  itemHeader: { flexDirection: "row", justifyContent: "space-between" },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemPrice: { fontSize: 16, fontWeight: "700" },
  itemDetail: { fontSize: 12, marginTop: 2, marginBottom: 8 },
  personChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  personChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  personChipText: { fontSize: 12, fontWeight: "500" },
  sharedCosts: { marginBottom: 16 },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  personName: { flex: 1, fontSize: 15, fontWeight: "500" },
  personAmount: { fontSize: 15, fontWeight: "700" },
  summaryCard: { alignItems: "center", marginTop: 16 },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 32, fontWeight: "800", marginTop: 4 },
});
