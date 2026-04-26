import React from "react";
import { View, StyleSheet, ViewStyle, Pressable, Text } from "react-native";
import { GlassView } from "expo-glass-effect";
import { X } from "lucide-react-native";
import { router } from "expo-router";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";
import { useTheme } from "../../core/theme";

interface HeaderItem {
  icon: React.ReactNode;
  callback: () => void;
}

interface BottomSheetScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  leadingItem?: HeaderItem | null;
  trailingItem?: HeaderItem | null;
}

/**
 * Reusable wrapper for screens presented as formSheet or modal.
 * - Liquid glass available → GlassView with circular glass effect + pill handle
 * - Otherwise            → BlurView + pill handle
 *
 * Place this as the root element of any modal/formSheet screen instead of a
 * plain View / SafeAreaView so that all sheets share a consistent look.
 *
 * Optional header with title and leading/trailing items:
 * - leadingItem: null (default) hides it
 * - title: displayed in center
 * - trailingItem: defaults to close button, null to hide
 */
export function BottomSheetScreen({
  children,
  style,
  title,
  leadingItem = null,
  trailingItem = {
    icon: <X size={20} />,
    callback: () => router.back(),
  },
}: BottomSheetScreenProps) {
  const isLiquidGlass = useLiquidGlass();
  const { resolvedMode, colors } = useTheme();
  const isDark = resolvedMode === "dark";

  const handle = (
    <View style={styles.handleWrap}>
      <View
        style={[
          styles.handle,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.28)"
              : "rgba(0,0,0,0.18)",
          },
        ]}
      />
    </View>
  );

  const header = title ? (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {/* Leading item */}
      {leadingItem &&
        (isLiquidGlass ? (
          <GlassView glassEffectStyle="clear" style={[styles.headerItem]}>
            <Pressable
              onPress={leadingItem.callback}
              hitSlop={8}
              style={styles.headerItem}
            >
              {leadingItem.icon}
            </Pressable>
          </GlassView>
        ) : (
          <Pressable
            onPress={leadingItem.callback}
            hitSlop={8}
            style={styles.headerItem}
          >
            {leadingItem.icon}
          </Pressable>
        ))}

      {/* Title - dynamic alignment */}
      <Text
        style={[
          styles.title,
          { color: colors.text.primary },
          {
            textAlign:
              leadingItem && !trailingItem
                ? "right"
                : leadingItem && trailingItem
                  ? "center"
                  : "left",
            flex: 1,
          },
        ]}
      >
        {title}
      </Text>

      {/* Trailing item */}
      {trailingItem &&
        (isLiquidGlass ? (
          <GlassView
            glassEffectStyle="clear"
            style={[styles.headerItem]}
            isInteractive={true}
          >
            <Pressable
              onPress={trailingItem.callback}
              hitSlop={8}
              style={styles.headerItem}
            >
              {trailingItem.icon}
            </Pressable>
          </GlassView>
        ) : (
          <Pressable
            onPress={trailingItem.callback}
            hitSlop={8}
            style={styles.headerItem}
          >
            {trailingItem.icon}
          </Pressable>
        ))}
    </View>
  ) : null;

  const inner = (
    <>
      {handle}
      {header}
      <View style={styles.body}>{children}</View>
    </>
  );

  if (isLiquidGlass) {
    return <View style={[styles.container, style]}>{inner}</View>;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg.sheet }, style]}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0,
  },
  headerItem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  body: {
    flex: 1,
  },
});
