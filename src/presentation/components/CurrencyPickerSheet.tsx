import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, Search, X } from "lucide-react-native";
import { useTheme } from "../../core/theme";
import { useCurrencyStore } from "../stores/useCurrencyStore";
import type { Currency } from "../../domain/entities/currency";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CurrencyPickerSheet({ visible, onClose }: Props) {
  const { colors, resolvedMode } = useTheme();
  const insets = useSafeAreaInsets();
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
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load currencies on first open
  useEffect(() => {
    if (visible) {
      fetchCurrencies();
      Animated.spring(slideAnim, {
        toValue: 1,
        damping: 22,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      setQuery("");
      clearSearch();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSearch = (text: string) => {
    setQuery(text);
    searchCurrencies(text);
  };

  const handleSelect = async (currency: Currency) => {
    await setCurrency(currency.code);
    Keyboard.dismiss();
    onClose();
  };

  const displayList = query.trim().length > 0 ? searchResults : currencies;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const isDark = resolvedMode === "dark";
  const sheetBg = isDark ? "#1C1B22" : "#FFFFFF";
  const handleBg = isDark ? "#3A3A40" : "#D1D5DB";
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
          <Text style={[styles.rowSymbol, { color: colors.accent.primary }]}>
            {item.symbol}
          </Text>
          <View>
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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="auto"
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: sheetBg,
            paddingBottom: insets.bottom + 8,
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: handleBg }]} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Base Currency
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: searchBg }]}
            hitSlop={8}
          >
            <X size={16} color={colors.text.secondary} />
          </Pressable>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchWrap,
            {
              backgroundColor: searchBg,
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.08)",
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
        <FlatList
          data={displayList}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={10}
          getItemLayout={(_, index) => ({
            length: 64,
            offset: 64 * index,
            index,
          })}
        />
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "75%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
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
    gap: 14,
  },
  rowSymbol: {
    fontSize: 18,
    fontWeight: "700",
    width: 32,
    textAlign: "center",
  },
  rowCode: {
    fontSize: 14,
    fontWeight: "600",
  },
  rowName: {
    fontSize: 12,
    marginTop: 1,
  },
});
