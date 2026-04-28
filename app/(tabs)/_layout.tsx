import React from "react";
import { Tabs, router } from "expo-router";
import { BlurView } from "expo-blur";
import { GlassView } from "expo-glass-effect";
import { View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../src/core/theme";
import { useLiquidGlass } from "../../src/hooks/useLiquidGlass";
import { Home, PieChart, Clock, User, Plus } from "lucide-react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICONS = [Home, PieChart, Clock, User] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, resolvedMode } = useTheme();
  const isLiquidGlassEnabled = useLiquidGlass();
  const insets = useSafeAreaInsets();

  // Split routes: left 2 | FAB gap | right 2
  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (route: (typeof state.routes)[0], globalIndex: number) => {
    const isActive = state.index === globalIndex;
    const Icon = TAB_ICONS[globalIndex];
    return (
      <Pressable
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tabBtn}
        hitSlop={8}
      >
        <Icon
          size={22}
          color={isActive ? colors.accent.primary : colors.icon.secondary}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.row} pointerEvents="box-none">
        {/* Floating glass pill */}
        <View style={styles.pill} pointerEvents="box-none">
          {isLiquidGlassEnabled ? (
            <GlassView
              glassEffectStyle="clear"
              style={{
                position: "absolute",
                top: -3,
                left: -4,
                right: -4,
                bottom: -3,
              }}
            />
          ) : (
            <BlurView
              intensity={80}
              tint={resolvedMode}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Left tabs */}
          {leftRoutes.map((r, i) => renderTab(r, i))}

          {/* FAB gap */}
          <View style={{ width: 64 }} pointerEvents="none" />

          {/* Right tabs */}
          {rightRoutes.map((r, i) => renderTab(r, i + 2))}
        </View>

        {/* Center FAB */}
        <Pressable
          onPress={() => router.push("/bill-type-selection-sheet")}
          onLongPress={() => router.push("/debug-sheet")}
          delayLongPress={400}
          style={[
            styles.fab,
            {
              backgroundColor: colors.accent.primary,
              shadowColor: "#000000",
            },
          ]}
        >
          <Plus size={22} color={colors.text.onAccent} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="expenses" options={{ title: "Expenses" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  row: {
    position: "relative",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 28,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    top: -22,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});
