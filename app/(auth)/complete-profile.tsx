import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { Input, ValidationRule } from "../../src/presentation/components/Input";
import { Button } from "../../src/presentation/components/Button";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useAuthStore } from "../../src/presentation/stores/useAuthStore";
import { useCurrencyStore } from "../../src/presentation/stores/useCurrencyStore";
import { toast } from "sonner-native";
import { ChevronRight, Globe } from "lucide-react-native";
import { UserRepositoryImpl } from "../../src/data/repositories/UserRepositoryImpl";

export default function CompleteProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((s) => s.session);

  const [username, setUsername] = useState(session?.user.username ?? "");
  const [phone, setPhone] = useState(session?.user.phone ?? "");
  const { selectedCurrency, fetchCurrencies } = useCurrencyStore();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const [loading, setLoading] = useState(false);
  const [usernameValid, setUsernameValid] = useState(
    (session?.user.username ?? "").length >= 8,
  );
  const [phoneValid, setPhoneValid] = useState(true);

  const canSubmit = usernameValid && phoneValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await UserRepositoryImpl.completeProfile({
        username,
        phone: phone || undefined,
        currency_id: selectedCurrency?.id,
      });
      router.replace("/(tabs)");
    } catch (e) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScreenContainer title="Complete Profile" isLargeTitle={false}>
        <View style={styles.intro}>
          <Text style={[styles.heading, { color: colors.text.primary }]}>
            One last step
          </Text>
          <Text style={[styles.sub, { color: colors.text.secondary }]}>
            Set your username and phone number so others can find and split with
            you.
          </Text>
        </View>

        <GlassCard style={styles.card}>
          <Input
            label="Username"
            placeholder="e.g. astronaut42"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            validationType={ValidationRule.MinChar}
            minChar={8}
            onValidChange={setUsernameValid}
          />
          <View style={styles.spacer} />
          <Input
            label="Phone number (optional)"
            placeholder="+62 812 3456 7890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            validationType={ValidationRule.Phone}
            onValidChange={setPhoneValid}
          />
          <View style={styles.currencyContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text.secondary }]}>
              Base Currency
            </Text>
            <Pressable
              onPress={() => router.push("/currency-selection-sheet")}
              style={({ pressed }) => [
                styles.currencyRow,
                {
                  backgroundColor: colors.bg.input,
                  borderColor: colors.border.default,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Globe size={16} color={colors.accent.primary} />
              <Text
                style={[
                  styles.currencyLabel,
                  {
                    color: selectedCurrency
                      ? colors.text.primary
                      : colors.text.tertiary,
                  },
                ]}
              >
                {selectedCurrency
                  ? `${selectedCurrency.code} — ${selectedCurrency.name}`
                  : "Select currency"}
              </Text>
              {selectedCurrency && (
                <Text
                  style={[
                    styles.currencySymbol,
                    { color: colors.accent.primary },
                  ]}
                >
                  {selectedCurrency.symbol}
                </Text>
              )}
              <ChevronRight size={16} color={colors.text.tertiary} />
            </Pressable>
          </View>
        </GlassCard>
      </ScreenContainer>

      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <Button
          title="Save & Continue"
          onPress={handleSubmit}
          fullWidth
          loading={loading}
          disabled={!canSubmit || loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  intro: {
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    gap: 0,
  },
  spacer: {
    height: 12,
  },
  currencyContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Geist_500Medium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  currencyRow: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  currencyLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  currencySymbol: {
    fontSize: 15,
    fontFamily: "Geist_400Regular",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});
