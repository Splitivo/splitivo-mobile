import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";

export default function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.accent.primary }]}>
            Splitivo
          </Text>
          <Text style={[styles.tagline, { color: colors.text.secondary }]}>
            Split smarter, transfer less.
          </Text>
        </View>

        <GlassCard style={styles.authCard}>
          <Button
            title="Continue with Google"
            onPress={() => router.push("/(tabs)")}
            variant="secondary"
            fullWidth
            style={styles.authButton}
          />
          <Button
            title="Continue with Apple"
            onPress={() => router.push("/(tabs)")}
            variant="secondary"
            fullWidth
            style={styles.authButton}
          />
          <Button
            title="Continue with Email or Phone"
            onPress={() => router.push("/(auth)/sign-in")}
            variant="primary"
            fullWidth
            style={styles.authButton}
          />
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  authCard: {
    gap: 12,
  },
  authButton: {
    marginBottom: 0,
  },
});
