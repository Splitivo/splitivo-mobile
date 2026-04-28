import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Text } from "../src/presentation/components/Text";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Check, Search, X } from "lucide-react-native";
import { useTheme } from "../src/core/theme";
import { useCurrencyStore } from "../src/presentation/stores/useCurrencyStore";
import { BottomSheetScreen } from "../src/presentation/components/BottomSheetScreen";
import type { Currency } from "../src/domain/entities/currency";

export default function CurrencySelectionSheet() {
  const { colors, resolvedMode } = useTheme();
  const {
    currencies,
    selectedCurrency,
    searchResults,
    fetchCurrencies,
    setCurrency,
    searchCurrencies,
    clearSearch,
  } = useCurrencyStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchCurrencies();
    return () => clearSearch();
  }, []);

  const handleSearch = (text: string) => {
    setQuery(text);
    searchCurrencies(text);
  };

  const handleSelect = async (currency: Currency) => {
    await setCurrency(currency.code);
    Keyboard.dismiss();
    router.back();
  };

  const displayList = query.trim().length > 0 ? searchResults : currencies;

  const isDark = resolvedMode === "dark";
  const searchBg = isDark ? colors.bg.input : "#F3F4F6";

  const renderItem = ({ item }: { item: Currency }) => {
    const isSelected = selectedCurrency?.code === item.code;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={({ pressed }) => [
          styles.row,
          {
            borderBottomColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.rowLeft}>
          <View style={styles.symbolContainer}>
            <Text style={[styles.rowSymbol, { color: colors.accent.primary }]}>
              {item.symbol}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.rowCode, { color: colors.text.primary }]}>
              {item.code}
            </Text>
            <Text style={[styles.rowName, { color: colors.text.tertiary }]}>
              {item.name}
            </Text>
          </View>
        </View>
        {isSelected && (
          <Check size={18} color={colors.accent.primary} strokeWidth={2.5} />
        )}
      </Pressable>
    );
  };

  return (
    <BottomSheetScreen
      title="Base Currency"
      trailingItem={{
        icon: <X size={20} color={colors.text.secondary} />,
        callback: () => router.back(),
      }}
    >
      {/* Search */}
      <View
        style={[
          styles.searchWrap,
          {
            backgroundColor: searchBg,
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        <Search size={16} color={colors.text.tertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="Search by name, code or symbol…"
          placeholderTextColor={colors.text.tertiary}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => handleSearch("")} hitSlop={8}>
            <X size={14} color={colors.text.tertiary} />
          </Pressable>
        )}
      </View>

      {/* List */}
      <FlashList
        data={displayList}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </BottomSheetScreen>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  row: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  symbolContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  rowSymbol: {
    fontSize: 18,
    fontWeight: "700",
  },
  rowCode: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  rowName: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});
