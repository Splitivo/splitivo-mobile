import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../core/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const bgColor = {
    primary: colors.accent.primary,
    secondary: "transparent",
    destructive: colors.status.error,
    ghost: "transparent",
  }[variant];

  const textColor = {
    primary: colors.text.onAccent,
    secondary: colors.text.primary,
    destructive: colors.text.onAccent,
    ghost: colors.accent.primary,
  }[variant];

  const borderColor = {
    primary: "transparent",
    secondary: colors.border.default,
    destructive: "transparent",
    ghost: "transparent",
  }[variant];

  const heights = { sm: 36, md: 46, lg: 54 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.accent.pressed : bgColor,
          height: heights[size],
          opacity: disabled ? 0.4 : 1,
          borderColor,
          borderWidth:
            variant === "secondary" ? StyleSheet.hairlineWidth * 2 : 0,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[styles.text, { color: textColor, fontSize: fontSizes[size] }]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },
  text: {
    fontFamily: "Geist_600SemiBold",
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  fullWidth: {
    width: "100%",
  },
});
