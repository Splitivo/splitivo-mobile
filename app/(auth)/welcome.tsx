import React from "react";
import { View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { Button } from "../../src/presentation/components/Button";
import { useAuthStore } from "../../src/presentation/stores/useAuthStore";

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { signIn, isLoading, error } = useAuthStore();

  const handleSignIn = async (provider: "apple" | "google") => {
    await signIn(provider);
    router.replace("/(tabs)");
  };

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

        <View style={styles.authButtons}>
          {Platform.OS === "ios" && (
            <Button
              title="Sign in with Apple"
              onPress={() => handleSignIn("apple")}
              variant="secondary"
              fullWidth
              disabled={isLoading}
            />
          )}
          <Button
            title="Sign in with Google"
            onPress={() => handleSignIn("google")}
            variant="secondary"
            fullWidth
            disabled={isLoading}
          />
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={colors.accent.primary}
              style={styles.spinner}
            />
          )}
          {error && (
            <Text style={[styles.error, { color: colors.status.error }]}>
              {error}
            </Text>
          )}
        </View>
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
  authButtons: {
    gap: 12,
  },
  spinner: {
    marginTop: 8,
  },
  error: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
