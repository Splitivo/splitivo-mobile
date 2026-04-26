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
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
