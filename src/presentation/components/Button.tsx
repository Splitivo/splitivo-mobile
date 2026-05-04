import React from "react";
import { Text, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../core/theme";
import { Spinner } from "./Spinner";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  glass?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  textColor?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  glass = false,
  style,
  fullWidth = false,
  icon,
  textColor,
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const variantBgColor = {
    primary: colors.accent.primary,
    secondary: "transparent",
    destructive: colors.status.error,
    ghost: "transparent",
  }[variant];

  const bgColor = glass ? colors.bg.glass : variantBgColor;

  const defaultTextColor = {
    primary: colors.text.onAccent,
    secondary: colors.text.primary,
    destructive: colors.text.onAccent,
    ghost: colors.accent.primary,
  }[variant];

  const resolvedTextColor = textColor ?? defaultTextColor;

  const variantBorderColor = {
    primary: "transparent",
    secondary: colors.border.default,
    destructive: "transparent",
    ghost: "transparent",
  }[variant];

  const borderColor = glass ? colors.border.default : variantBorderColor;

  const heights = { sm: 36, md: 46, lg: 54 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgColor,
          height: heights[size],
          opacity: disabled ? 0.4 : pressed ? 0.65 : 1,
          borderColor,
          borderWidth:
            glass || variant === "secondary" ? StyleSheet.hairlineWidth * 2 : 0,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <Spinner size={18} color={resolvedTextColor} strokeWidth={2} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: resolvedTextColor, fontSize: fontSizes[size] },
            ]}
          >
            {title}
          </Text>
        </View>
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
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
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
