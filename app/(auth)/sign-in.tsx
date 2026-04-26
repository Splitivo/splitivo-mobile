import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Input } from "../../src/presentation/components/Input";

export default function SignInScreen() {
  const { colors } = useTheme();
  const [inputMode, setInputMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Mock sign in — go straight to tabs
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg.primary }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Sign In
        </Text>

        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setInputMode("email")}
            style={[
              styles.modeButton,
              inputMode === "email" && {
                backgroundColor: colors.accent.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.modeText,
                {
                  color:
                    inputMode === "email"
                      ? colors.text.onAccent
                      : colors.text.secondary,
                },
              ]}
            >
              Email
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setInputMode("phone")}
            style={[
              styles.modeButton,
              inputMode === "phone" && {
                backgroundColor: colors.accent.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.modeText,
                {
                  color:
                    inputMode === "phone"
                      ? colors.text.onAccent
                      : colors.text.secondary,
                },
              ]}
            >
              Phone
            </Text>
          </Pressable>
        </View>

        <GlassCard>
          {inputMode === "email" ? (
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Input
              label="Phone"
              placeholder="+1 234 567 8900"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          )}

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable>
            <Text style={[styles.forgotLink, { color: colors.accent.primary }]}>
              Forgot Password?
            </Text>
          </Pressable>

          <Button title="Sign In" onPress={handleSignIn} fullWidth />
        </GlassCard>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.text.secondary }}>
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={{ color: colors.accent.primary, fontWeight: "600" }}>
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  modeToggle: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    alignSelf: "center",
  },
  modeButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeText: { fontSize: 14, fontWeight: "600" },
  forgotLink: { fontSize: 14, marginBottom: 16, textAlign: "right" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
