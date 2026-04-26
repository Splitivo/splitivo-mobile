import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useTripStore } from "../../src/presentation/stores/useTripStore";
import { useUserStore } from "../../src/presentation/stores/useUserStore";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Input } from "../../src/presentation/components/Input";
import { Avatar } from "../../src/presentation/components/Avatar";
import { XCircle } from "lucide-react-native";
import type { Participant } from "../../src/domain/entities/user";

export default function CreateTripScreen() {
  const { colors } = useTheme();
  const { createTrip } = useTripStore();
  const { user } = useUserStore();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [guestName, setGuestName] = useState("");

  const addGuest = () => {
    if (!guestName.trim()) return;
    setParticipants((prev) => [
      ...prev,
      { id: `guest_${Date.now()}`, name: guestName.trim(), isGuest: true },
    ]);
    setGuestName("");
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    const allParticipants: Participant[] = [
      ...(user
        ? [
            {
              id: user.id,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
              isGuest: false as const,
            },
          ]
        : []),
      ...participants,
    ];
    await createTrip({
      id: `trip_${Date.now()}`,
      name: name.trim(),
      startDate: startDate || new Date().toISOString().slice(0, 10),
      endDate: endDate || "",
      currency,
      participants: allParticipants,
      bills: [],
      status: "active",
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg.primary }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          New Trip
        </Text>

        <Input
          label="Trip Name"
          placeholder="e.g. Bali Trip 2026"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Start Date"
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />
        <Input
          label="End Date (optional)"
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />
        <Input
          label="Currency"
          placeholder="IDR"
          value={currency}
          onChangeText={setCurrency}
        />

        {/* Participants */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          Participants
        </Text>

        {/* Self */}
        {user && (
          <View style={styles.personRow}>
            <Avatar name={user.displayName} size={36} />
            <Text style={[styles.personName, { color: colors.text.primary }]}>
              {user.displayName} (You)
            </Text>
          </View>
        )}

        {participants.map((p) => {
          const pName = p.isGuest ? p.name : p.displayName;
          return (
            <View key={p.id} style={styles.personRow}>
              <Avatar name={pName} size={36} />
              <Text style={[styles.personName, { color: colors.text.primary }]}>
                {pName}
              </Text>
              <Pressable onPress={() => removeParticipant(p.id)}>
                <XCircle size={22} color={colors.status.error} />
              </Pressable>
            </View>
          );
        })}

        <View style={styles.addRow}>
          <TextInput
            placeholder="Add guest name"
            placeholderTextColor={colors.text.tertiary}
            value={guestName}
            onChangeText={setGuestName}
            onSubmitEditing={addGuest}
            style={[
              styles.guestInput,
              {
                color: colors.text.primary,
                backgroundColor: colors.bg.input,
                borderColor: colors.border.default,
              },
            ]}
          />
          <Button title="Add" size="sm" onPress={addGuest} />
        </View>

        <Button
          title="Create Trip"
          onPress={handleCreate}
          fullWidth
          size="lg"
          style={{ marginTop: 24, marginBottom: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  personName: { flex: 1, fontSize: 15, fontWeight: "500" },
  addRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  guestInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
});
