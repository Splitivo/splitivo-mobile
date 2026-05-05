import React, { useEffect } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useTheme } from "../../core/theme";

export enum ValidationRule {
  Required = "required",
  Email = "email",
  Phone = "phone",
  CharLimit = "charLimit",
  MinChar = "minChar",
}

function validate(
  value: string,
  rule: ValidationRule,
  charLimit?: number,
  minChar?: number,
): string | null {
  if (!value) {
    if (rule === ValidationRule.Required) return "This field is required.";
    if (rule === ValidationRule.MinChar) return `Min ${minChar} characters.`;
    return null; // empty is fine for non-Required rules
  }
  switch (rule) {
    case ValidationRule.Email:
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? null
        : "Enter a valid email address.";
    case ValidationRule.Phone:
      return /^\+?[\d\s\-().]{7,20}$/.test(value)
        ? null
        : "Enter a valid phone number.";
    case ValidationRule.CharLimit:
      return charLimit !== undefined && value.length > charLimit
        ? `Max ${charLimit} characters.`
        : null;
    case ValidationRule.MinChar:
      return minChar !== undefined && value.length < minChar
        ? `Min ${minChar} characters.`
        : null;
    default:
      return null;
  }
}

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Validation rule to apply on the current value. */
  validationType?: ValidationRule;
  /** Max characters — only used when validationType is CharLimit. */
  charLimit?: number;
  /** Min characters — only used when validationType is MinChar. */
  minChar?: number;
  /** Called with `true` when value passes validation, `false` otherwise. */
  onValidChange?: (isValid: boolean) => void;
  /** Hides the context menu (Copy, Paste, Cut, Select) entirely. */
  disableActions?: boolean;
}

export function Input({
  label,
  error,
  style,
  validationType,
  charLimit,
  minChar,
  onValidChange,
  disableActions,
  value,
  onChangeText,
  ...props
}: InputProps) {
  const { colors } = useTheme();

  const validationError =
    validationType !== undefined && value !== undefined
      ? validate(String(value), validationType, charLimit, minChar)
      : null;

  const displayError =
    error ??
    (value !== undefined && value !== ""
      ? (validationError ?? undefined)
      : undefined);

  useEffect(() => {
    if (validationType === undefined || onValidChange === undefined) return;
    const err =
      value !== undefined
        ? validate(String(value), validationType, charLimit, minChar)
        : null;
    onValidChange(err === null);
  }, [value, validationType, charLimit, minChar]);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            backgroundColor: colors.bg.input,
            color: colors.text.primary,
            borderColor: displayError
              ? colors.status.error
              : colors.border.default,
          },
          style,
        ]}
        placeholderTextColor={colors.text.tertiary}
        cursorColor={colors.accent.primary}
        selectionColor={colors.accent.primary}
        contextMenuHidden={!!disableActions}
        {...props}
      />
      {displayError && (
        <Text style={[styles.error, { color: colors.status.error }]}>
          {displayError}
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
