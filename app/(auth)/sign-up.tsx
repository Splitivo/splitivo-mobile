import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../src/core/theme";
import { GlassCard } from "../../src/presentation/components/GlassCard";
import { Button } from "../../src/presentation/components/Button";
import { Input } from "../../src/presentation/components/Input";

export default function SignUpScreen() {
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    router.push("/(auth)/verify-otp");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg.primary }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Create Account
        </Text>

        <GlassCard>
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Sign Up" onPress={handleSignUp} fullWidth />
        </GlassCard>

        <View style={styles.switchRow}>
          <Text style={{ color: colors.text.secondary }}>
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={{ color: colors.accent.primary, fontWeight: "600" }}>
              Sign In
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
});
