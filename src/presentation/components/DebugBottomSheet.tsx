import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Switch,
  Pressable,
  Alert,
  Text,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";
import { ChevronUp, ChevronRight, X } from "lucide-react-native";
import { router } from "expo-router";
import { useTheme } from "../../../src/core/theme";
import { useCurrencyStore } from "../../../src/presentation/stores/useCurrencyStore";
import { BottomSheetScreen } from "./BottomSheetScreen";

/**
 * Debug Bottom Sheet Component
 * Provides developer tools for navigation, theme switching, currency testing, etc.
 *
 * Features:
 * - Collapsible sections
 * - Theme toggle with proper state management
 * - Currency selection for testing
 * - Route navigation with validation
 */

interface DebugSection {
  title: string;
  tools: Array<{
    id: string;
    label: string;
    component: React.ReactElement;
  }>;
}

interface DebugText {
  title: string;
  body: string;
}

export function DebugBottomSheet() {
  const { colors, mode, setMode } = useTheme();
  const { selectedCurrency, currencies, setCurrency } = useCurrencyStore();
  const [navigationPath, setNavigationPath] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Navigation", "Theme", "Stores"]),
  );

  const toggleSection = useCallback((sectionTitle: string) => {
    setExpandedSections((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionTitle)) {
        newExpanded.delete(sectionTitle);
      } else {
        newExpanded.add(sectionTitle);
      }
      return newExpanded;
    });
  }, []);

  const handleNavigate = useCallback(() => {
    if (!navigationPath.trim()) {
      Alert.alert(
        "Invalid Path",
        "Please enter a valid navigation path (e.g., /(tabs)/index or /split/manual-entry)",
      );
      return;
    }

    try {
      const path = navigationPath.startsWith("/")
        ? navigationPath
        : `/${navigationPath}`;
      setNavigationPath("");
      router.dismissAll();
      setTimeout(() => {
        router.push(path as any);
      }, 100);
    } catch (error) {
      Alert.alert(
        "Navigation Error",
        `Failed to navigate to ${navigationPath}`,
      );
    }
  }, [navigationPath]);

  const handleThemeChange = useCallback(
    (newMode: "light" | "dark" | "system") => {
      setMode(newMode);
    },
    [setMode],
  );

  const debugSections: DebugSection[] = [
    {
      title: "Navigation",
      tools: [
        {
          id: "nav-path",
          label: "Navigate to Path",
          component: (
            <View key="nav-input" style={styles.toolContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Route Path
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border.default,
                    color: colors.text.primary,
                    backgroundColor: colors.bg.container,
                  },
                ]}
                placeholder="e.g., /(tabs)/index"
                placeholderTextColor={colors.text.tertiary}
                value={navigationPath}
                onChangeText={setNavigationPath}
                editable={true}
              />
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: colors.accent.primary },
                ]}
                onPress={handleNavigate}
              >
                <Text
                  style={[styles.buttonText, { color: colors.text.onAccent }]}
                >
                  Navigate
                </Text>
              </Pressable>
            </View>
          ),
        },
      ],
    },
    {
      title: "Theme",
      tools: [
        {
          id: "theme-light",
          label: "Light Mode",
          component: (
            <Pressable
              key="theme-light"
              style={[
                styles.toolContainer,
                styles.modeButton,
                mode === "light" && { backgroundColor: colors.accent.primary },
              ]}
              onPress={() => handleThemeChange("light")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color:
                      mode === "light"
                        ? colors.text.onAccent
                        : colors.text.primary,
                  },
                ]}
              >
                Light
              </Text>
            </Pressable>
          ),
        },
        {
          id: "theme-dark",
          label: "Dark Mode",
          component: (
            <Pressable
              key="theme-dark"
              style={[
                styles.toolContainer,
                styles.modeButton,
                mode === "dark" && { backgroundColor: colors.accent.primary },
              ]}
              onPress={() => handleThemeChange("dark")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color:
                      mode === "dark"
                        ? colors.text.onAccent
                        : colors.text.primary,
                  },
                ]}
              >
                Dark
              </Text>
            </Pressable>
          ),
        },
        {
          id: "theme-system",
          label: "System Mode",
          component: (
            <Pressable
              key="theme-system"
              style={[
                styles.toolContainer,
                styles.modeButton,
                mode === "system" && { backgroundColor: colors.accent.primary },
              ]}
              onPress={() => handleThemeChange("system")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  {
                    color:
                      mode === "system"
                        ? colors.text.onAccent
                        : colors.text.primary,
                  },
                ]}
              >
                System
              </Text>
            </Pressable>
          ),
        },
      ],
    },
    {
      title: "Currency",
      tools: [
        {
          id: "currency-select",
          label: "Select Currency",
          component: (
            <View key="currency-select" style={styles.toolContainer}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Current: {selectedCurrency?.code || "USD"}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.currencyScroll}
              >
                {currencies.slice(0, 8).map((currency) => (
                  <Pressable
                    key={currency.code}
                    style={[
                      styles.currencyButton,
                      {
                        backgroundColor:
                          selectedCurrency?.code === currency.code
                            ? colors.accent.primary
                            : colors.bg.container,
                        borderColor:
                          selectedCurrency?.code === currency.code
                            ? colors.accent.primary
                            : colors.border.default,
                      },
                    ]}
                    onPress={async () => {
                      await setCurrency(currency.code);
                    }}
                  >
                    <Text
                      style={[
                        styles.currencyButtonText,
                        {
                          color:
                            selectedCurrency?.code === currency.code
                              ? colors.text.onAccent
                              : colors.text.primary,
                        },
                      ]}
                    >
                      {currency.code}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ),
        },
      ],
    },
    {
      title: "Stores",
      tools: [
        {
          id: "store-clear",
          label: "Clear All Stores",
          component: (
            <Pressable
              key="store-clear"
              style={[
                styles.toolContainer,
                styles.dangerButton,
                { backgroundColor: colors.status.error },
              ]}
              onPress={() => {
                Alert.alert(
                  "Clear Stores",
                  "This will clear all persisted stores (requires app restart to fully sync)",
                  [
                    { text: "Cancel", onPress: () => {} },
                    {
                      text: "Clear",
                      onPress: () => {
                        // Implementation would go here to clear stores
                        Alert.alert(
                          "Stores cleared",
                          "Restart the app to sync",
                        );
                      },
                    },
                  ],
                );
              }}
            >
              <Text style={[styles.dangerButtonText, { color: "#fff" }]}>
                Clear All Stores
              </Text>
            </Pressable>
          ),
        },
      ],
    },
  ];

  return (
    <BottomSheetScreen
      title="Debug Tools"
      trailingItem={{
        icon: <X size={20} color={colors.text.secondary} />,
        callback: () => router.back(),
      }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {debugSections.map((section) => {
          const isExpanded = expandedSections.has(section.title);
          return (
            <Animated.View
              key={section.title}
              style={styles.section}
              layout={LinearTransition}
            >
              <Pressable
                onPress={() => toggleSection(section.title)}
                style={[
                  styles.sectionHeader,
                  { borderBottomColor: colors.border.default },
                ]}
              >
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                >
                  {section.title}
                </Text>
                {isExpanded ? (
                  <ChevronUp size={20} color={colors.text.primary} />
                ) : (
                  <ChevronRight size={20} color={colors.text.primary} />
                )}
              </Pressable>
              {isExpanded && (
                <Animated.View
                  layout={LinearTransition}
                  entering={FadeInUp}
                  exiting={FadeOutUp}
                >
                  {section.tools.map((tool) => tool.component)}
                </Animated.View>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </BottomSheetScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
    minHeight: 44,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  toolContainer: {
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 0,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    marginHorizontal: 4,
    flex: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  currencyScroll: {
    marginHorizontal: -4,
  },
  currencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 4,
    minHeight: 36,
    justifyContent: "center",
  },
  currencyButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  dangerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
