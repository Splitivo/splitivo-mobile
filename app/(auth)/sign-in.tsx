import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { Text } from "../../src/presentation/components/Text";
import { ScreenContainer } from "../../src/presentation/components/ScreenContainer";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { Button } from "../../src/presentation/components/Button";
import { useAuthStore } from "../../src/presentation/stores/useAuthStore";

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 488 488">
      <G>
        <Path
          fill="#4285F4"
          d="M488 252c0-17-1.5-33.3-4.3-49H249v92.7h134.8c-5.8 31.3-23.3 57.8-49.7 75.6v62.8h80.4C465.9 391 488 325.7 488 252z"
        />
        <Path
          fill="#34A853"
          d="M249 488c67.5 0 124.2-22.4 165.6-60.8l-80.4-62.8c-22.4 15-51 23.8-85.2 23.8-65.5 0-121-44.2-140.8-103.6H25.3v64.8C66.5 433.7 152.1 488 249 488z"
        />
        <Path
          fill="#FBBC05"
          d="M108.2 284.6A147.7 147.7 0 0 1 102.5 244c0-14.1 2.4-27.8 5.7-40.6v-64.8H25.3A243.9 243.9 0 0 0 0 244c0 39.3 9.3 76.5 25.3 109.4l82.9-68.8z"
        />
        <Path
          fill="#EA4335"
          d="M249 96.8c36.9 0 70 12.7 96.1 37.6l72-72C375.1 22.4 318.4 0 249 0 152.1 0 66.5 54.3 25.3 134.6l82.9 64.8C128 140 183.5 96.8 249 96.8z"
        />
      </G>
    </Svg>
  );
}

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { signIn, isLoading, error } = useAuthStore();
  const [loadingProvider, setLoadingProvider] = useState<
    "apple" | "google" | null
  >(null);

  const handleSignIn = async (provider: "apple" | "google") => {
    setLoadingProvider(provider);
    await signIn(provider);
    setLoadingProvider(null);
    // Only navigate if sign-in succeeded (no error set in store)
    const { session } = useAuthStore.getState();
    if (session) {
      router.replace("/(tabs)");
    }
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
              glass
              fullWidth
              disabled={isLoading && loadingProvider === "apple"}
              loading={loadingProvider === "apple"}
              icon={<AppleIcon color={colors.text.primary} />}
            />
          )}
          <Button
            title="Sign in with Google"
            onPress={() => handleSignIn("google")}
            variant="secondary"
            glass
            fullWidth
            disabled={isLoading && loadingProvider === "google"}
            loading={loadingProvider === "google"}
            icon={<GoogleIcon />}
          />
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
  error: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
