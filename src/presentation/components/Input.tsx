import React from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useTheme } from "../../core/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.bg.input,
            color: colors.text.primary,
            borderColor: error ? colors.status.error : colors.border.default,
          },
          style,
        ]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.status.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Geist_500Medium",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: "Geist_400Regular",
  },
  error: {
    fontSize: 12,
    fontFamily: "Geist_400Regular",
    marginTop: 5,
  },
});
