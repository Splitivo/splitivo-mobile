import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  Pressable,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../core/theme";
import { useLiquidGlass } from "../../hooks/useLiquidGlass";

export type NavBarItem =
  | { type: "backButton" }
  | { type: "custom"; icon: React.ReactNode; onPress: () => void };

const DARK_GRADIENT = ["#141414", "#0A0A0A", "#000000"] as const;
const LIGHT_GRADIENT = ["#FFFFFF", "#F5F5F5", "#EBEBEB"] as const;

const COLLAPSE_START = 40;
const COLLAPSE_END = 88;

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** When provided, renders an iOS-style large title that collapses into a compact nav bar on scroll. */
  title?: string;
  subtitle?: string;
  /** Optional element placed on the left of the compact nav bar. */
  navBarLeading?: NavBarItem;
  /** Optional element placed on the right of the compact nav bar. */
  navBarTrailing?: NavBarItem;
  /**
   * When true (default): large title in scroll, compact nav bar fades in on scroll.
   * When false: compact nav bar is always visible from the start.
   */
  isLargeTitle?: boolean;
  /** Extra style for the scroll content container (only used when title is set). */
  contentContainerStyle?: ViewStyle;
  /**
   * When provided, the nav bar is always visible and shows this text initially,
   * crossfading into `title` as the large title scrolls away.
   */
  navBarTitle?: string;
  /** When true, enables pull-to-refresh on the scroll view. */
  refreshable?: boolean;
  /** Called when the user pulls to refresh. Must resolve/complete to hide the indicator. */
  onRefresh?: () => Promise<void>;
}

/**
 * Replaces SafeAreaView on tab screens.
 * - Full-screen LinearGradient background
 * - Without `title`: renders children directly (existing behaviour)
 * - With `title`: iOS large-title pattern — big heading scrolls away and a
 *   blurred compact nav bar fades in with the title centred.
 */
export function ScreenContainer({
  children,
  style,
  title,
  subtitle,
  navBarLeading,
  navBarTrailing,
  isLargeTitle = true,
  contentContainerStyle,
  navBarTitle,
  refreshable = false,
  onRefresh,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { resolvedMode, colors } = useTheme();
  const isLiquidGlass = useLiquidGlass();
  const isDark = resolvedMode === "dark";
  const gradientColors = isDark ? DARK_GRADIENT : LIGHT_GRADIENT;

  // Single Animated.Value tracking raw contentOffset.y — driven natively on UI thread
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const maxPullRef = useRef(0);
  const NAV_BAR_TOTAL = insets.top + 52;
  const PULL_THRESHOLD = 60;

  // Pull circle opacity: visible while pulling, invisible at rest
  const pullCircleOpacity = scrollOffset.interpolate({
    inputRange: [-PULL_THRESHOLD, -4, 0],
    outputRange: [1, 0.1, 0],
    extrapolate: "clamp",
  });

  // Arc: strokeDashoffset = CIRCUMFERENCE at 0 pull, 0 at full pull
  const pullStrokeDashoffset = scrollOffset.interpolate({
    inputRange: [-PULL_THRESHOLD, 0],
    outputRange: [0, CIRCUMFERENCE],
    extrapolate: "clamp",
  });

  // JS-side listener only for tracking max pull — fires rarely, not on every frame
  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y < 0 && -y > maxPullRef.current) maxPullRef.current = -y;
  };

  const handleScrollEndDrag = () => {
    const reached = maxPullRef.current >= PULL_THRESHOLD;
    maxPullRef.current = 0;
    if (reached && onRefresh) {
      onRefresh();
    }
  };

  const navBarOpacity = scrollOffset.interpolate({
    inputRange: [COLLAPSE_START, COLLAPSE_END],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const pageNavBarOpacity = scrollOffset.interpolate({
    inputRange: [COLLAPSE_START, COLLAPSE_END],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const resolvedNavBarOpacity =
    isLargeTitle && !navBarTitle ? navBarOpacity : 1;

  const navBarContent = (
    <>
      <BlurView
        intensity={isDark ? 60 : 80}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.navBarContent, { marginTop: insets.top }]}>
        {navBarLeading ? (
          <View style={styles.navBarLeading}>
            <NavBarItemView item={navBarLeading} colors={colors} />
          </View>
        ) : null}
        {navBarTitle ? (
          <View style={styles.navBarTitleContainer}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                styles.navBarTitleInner,
                { opacity: pageNavBarOpacity },
              ]}
            >
              <Text
                style={[styles.navBarTitle, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {navBarTitle}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                styles.navBarTitleInner,
                { opacity: navBarOpacity },
              ]}
            >
              <Text
                style={[styles.navBarTitle, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </Animated.View>
          </View>
        ) : (
          <Text
            style={[styles.navBarTitle, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {navBarTrailing ? (
          <View style={styles.navBarTrailing}>
            <NavBarItemView item={navBarTrailing} colors={colors} />
          </View>
        ) : null}
      </View>
      <View
        style={[
          styles.navBarSeparator,
          { backgroundColor: colors.border.default },
        ]}
      />
    </>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Full-screen background gradient */}
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
      />

      {title || navBarLeading || navBarTrailing ? (
        <>
          {/* Scrollable content with large title inside */}
          <Animated.ScrollView
            contentContainerStyle={[
              {
                paddingTop:
                  isLargeTitle && !navBarTitle
                    ? insets.top + 16
                    : NAV_BAR_TOTAL + 16,
                paddingHorizontal: 20,
                marginTop: refreshable ? -24 : 0,
              },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            bounces
            alwaysBounceVertical
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollOffset } } }],
              { useNativeDriver: true, listener: handleScroll },
            )}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={1}
          >
            {/* Pull circle — arc grows as user pulls, driven entirely by Animated values */}
            {refreshable && (
              <Animated.View
                style={[
                  styles.refreshSpinnerWrap,
                  { opacity: pullCircleOpacity },
                ]}
                pointerEvents="none"
              >
                <PullCircle
                  strokeDashoffset={pullStrokeDashoffset}
                  color={colors.text.primary}
                />
              </Animated.View>
            )}

            {isLargeTitle ? (
              <View style={styles.largeHeader}>
                <Text
                  style={[styles.largeTitle, { color: colors.text.primary }]}
                >
                  {title}
                </Text>
                {subtitle ? (
                  <Text
                    style={[
                      styles.largeSubtitle,
                      { color: colors.text.tertiary },
                    ]}
                  >
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            ) : null}

            {children}

            <View style={{ height: 120 }} />
          </Animated.ScrollView>

          {/* Compact nav bar */}
          {isLargeTitle ? (
            <Animated.View
              style={[
                styles.navBar,
                { height: NAV_BAR_TOTAL, opacity: resolvedNavBarOpacity },
              ]}
              pointerEvents="box-none"
            >
              {navBarContent}
            </Animated.View>
          ) : (
            <View
              style={[styles.navBar, { height: NAV_BAR_TOTAL }]}
              pointerEvents="box-none"
            >
              {navBarContent}
            </View>
          )}
        </>
      ) : (
        <View style={[styles.content, { paddingTop: insets.top }]}>
          {children}
        </View>
      )}
    </View>
  );
}

type Colors = ReturnType<typeof useTheme>["colors"];

const CIRCLE_SIZE = 24;
const RADIUS = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function PullCircle({
  strokeDashoffset,
  color,
}: {
  strokeDashoffset: Animated.AnimatedInterpolation<number>;
  color: string;
}) {
  return (
    <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
      <AnimatedCircle
        cx={CIRCLE_SIZE / 2}
        cy={CIRCLE_SIZE / 2}
        r={RADIUS}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
      />
    </Svg>
  );
}

function NavBarItemView({
  item,
  colors,
}: {
  item: NavBarItem;
  colors: Colors;
}) {
  if (item.type === "backButton") {
    return (
      <Pressable onPress={() => router.back()} hitSlop={8}>
        <ArrowLeft size={22} color={colors.text.primary} />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={item.onPress} hitSlop={8}>
      {item.icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },

  // Large title (scrolls with content)
  largeHeader: { marginBottom: 20 },
  largeTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Geist_700Bold",
    letterSpacing: -0.8,
  },
  largeSubtitle: { fontSize: 14, marginTop: 4, fontFamily: "Geist_400Regular" },

  // Compact nav bar
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  navBarSeparator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  navBarContent: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  navBarTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Geist_600SemiBold",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  navBarTitleContainer: {
    flex: 1,
    height: 44,
  },
  navBarTitleInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  navBarLeading: { position: "absolute", left: 16 },
  navBarTrailing: { position: "absolute", right: 16 },
  refreshSpinnerWrap: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 4,
  },
});
