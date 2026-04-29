import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  LayoutChangeEvent,
  ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "../../core/theme";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";

interface SegmentedControlProps<T extends string> {
  options: T[];
  labels?: Partial<Record<T, string>>;
  selected: T;
  onSelect: (value: T) => void;
  /** ms to wait before firing onSelect — lets the slide animation finish first */
  delay?: number;
  style?: ViewStyle;
  liquidGlass?: "auto" | "disabled";
}

export function SegmentedControl<T extends string>({
  options,
  labels,
  selected,
  onSelect,
  delay,
  style,
  liquidGlass = "auto",
}: SegmentedControlProps<T>) {
  const { colors, resolvedMode } = useTheme();
  const isLiquidGlass = useLiquidGlass();
  const isDark = resolvedMode === "dark";

  const selectedIndex = options.indexOf(selected);
  const [visualIndex, setVisualIndex] = useState(selectedIndex);
  const [segmentWidth, setSegmentWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Keep visual in sync when parent changes selected externally
  useEffect(() => {
    setVisualIndex(options.indexOf(selected));
  }, [selected]);

  useEffect(() => {
    if (segmentWidth === 0) return;
    Animated.spring(translateX, {
      toValue: visualIndex * segmentWidth,
      useNativeDriver: true,
      damping: 30,
      stiffness: 280,
      mass: 0.6,
    }).start();
  }, [visualIndex, segmentWidth]);

  const handleSelect = (value: T) => {
    // Move pill immediately
    setVisualIndex(options.indexOf(value));
    if (delay) {
      setTimeout(() => onSelect(value), delay);
    } else {
      onSelect(value);
    }
  };

  const onRowLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    // subtract padding (6 each side = 12 total) then divide by count
    setSegmentWidth((totalWidth - 12) / options.length);
  };

  const inner = (
    <View style={styles.row} onLayout={onRowLayout}>
      {/* sliding pill */}
      {segmentWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: segmentWidth,
              backgroundColor: colors.accent.primary,
              transform: [{ translateX }],
            },
          ]}
          pointerEvents="none"
        />
      )}
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => handleSelect(option)}
          style={styles.segment}
        >
          <Text
            style={[
              styles.label,
              {
                color:
                  options.indexOf(option) === visualIndex
                    ? colors.text.onAccent
                    : colors.text.secondary,
              },
            ]}
          >
            {labels?.[option] ?? option}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  if (liquidGlass === "disabled") {
    return (
      <View
        style={[
          styles.shadow,
          styles.wrap,
          {
            backgroundColor: colors.bg.glass,
            borderWidth: 1,
            borderColor: colors.border.default,
          },
          style,
        ]}
      >
        {inner}
      </View>
    );
  }

  if (isLiquidGlass) {
    return (
      <View style={[styles.shadow, style]}>
        <GlassView
          glassEffectStyle="regular"
          colorScheme={isDark ? "dark" : "light"}
          style={styles.wrap}
        >
          {inner}
        </GlassView>
      </View>
    );
  }

  return (
    <View style={[styles.shadow, style]}>
      <View style={[styles.wrap, { overflow: "hidden" }]}>
        <BlurView
          intensity={isDark ? 60 : 80}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        {inner}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  wrap: { borderRadius: 16, overflow: "hidden" },
  row: { flexDirection: "row", padding: 6 },
  pill: {
    position: "absolute",
    top: 6,
    left: 6,
    bottom: 6,
    borderRadius: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontFamily: "Geist_600SemiBold",
    fontWeight: "600",
    letterSpacing: -0.1,
  },
});
