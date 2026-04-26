import React, { useEffect } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../core/theme";

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { colors } = useTheme();
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeleton.base, colors.skeleton.highlight],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
}

export function SummaryCardSkeleton() {
  return (
    <View style={styles.summaryCard}>
      {/* centered label + big total — mirrors summaryCenter paddingVertical:20 */}
      <View style={styles.summaryCenter}>
        <Skeleton width={110} height={12} borderRadius={6} />
        <View style={{ height: 6 }} />
        <Skeleton width={130} height={42} borderRadius={8} />
      </View>
      {/* 3 breakdown rows — gap:12, mirrors breakdownRow */}
      <View style={styles.breakdownList}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.breakdownRow}>
            <Skeleton width={40} height={40} borderRadius={12} />
            <View style={styles.breakdownContent}>
              <View style={styles.breakdownTop}>
                <Skeleton width="45%" height={13} borderRadius={5} />
                <Skeleton width={52} height={13} borderRadius={5} />
              </View>
              <View style={{ height: 6 }} />
              <Skeleton width="80%" height={6} borderRadius={3} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="60%" height={16} />
      <View style={styles.spacer} />
      <Skeleton width="40%" height={12} />
      <View style={styles.spacer} />
      <Skeleton width="80%" height={12} />
    </View>
  );
}

export function ListRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={44} height={44} borderRadius={22} />
      <View style={styles.rowContent}>
        <Skeleton width="70%" height={14} />
        <View style={styles.spacerSmall} />
        <Skeleton width="50%" height={12} />
      </View>
      <Skeleton width={60} height={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    padding: 16, // matches GlassCard inner padding
    borderRadius: 24, // matches GlassCard strong radius
    marginBottom: 24, // matches summaryCard style
  },
  summaryCenter: {
    alignItems: "center",
    paddingVertical: 20, // matches summaryCenter paddingVertical
  },
  breakdownList: {
    gap: 12, // matches breakdownList gap
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // matches breakdownRow gap
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6, // matches breakdownTop marginBottom
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  spacer: {
    height: 8,
  },
  spacerSmall: {
    height: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  rowContent: {
    flex: 1,
  },
});
