import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { Input, ValidationRule } from "../../src/presentation/components/Input";
import { Button } from "../../src/presentation/components/Button";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { useAuthStore } from "../../src/presentation/stores/useAuthStore";
import { toast } from "sonner-native";

export default function CompleteProfileScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const session = useAuthStore((s) => s.session);

  const [username, setUsername] = useState(session?.user.username ?? "");
  const [phone, setPhone] = useState(session?.user.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [usernameValid, setUsernameValid] = useState(
    (session?.user.username ?? "").length > 0,
  );
  const [phoneValid, setPhoneValid] = useState(true);

  const canSubmit = usernameValid && phoneValid;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // TODO: call update profile API and patch session user
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
            placeholder="e.g. haikalfadil"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            validationType={ValidationRule.Required}
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});
