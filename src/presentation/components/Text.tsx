import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";

/**
 * Drop-in replacement for React Native's Text.
 * Applies Geist_400Regular as the base font family so custom fonts
 * work reliably on iOS (where Text.defaultProps is not guaranteed
 * to work with the new Fabric renderer).
 */
export function Text({ style, ...props }: TextProps) {
  return <RNText style={[styles.base, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Geist_400Regular",
  },
});
