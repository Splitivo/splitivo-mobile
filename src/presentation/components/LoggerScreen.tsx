import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { ChevronLeft, Trash2 } from "lucide-react-native";
import { useTheme } from "../../core/theme";
import { useLoggerStore, LogEntry, LogLevel } from "../stores/useLoggerStore";
import { JsonHighlighter } from "./JsonHighlighter";

interface Props {
  onBack: () => void;
}

const LEVEL_COLORS: Record<LogLevel, string> = {
  log: "#9CA3AF",
  info: "#60A5FA",
  warn: "#FBBF24",
  error: "#F87171",
};

const LEVEL_BG: Record<LogLevel, string> = {
  log: "rgba(156,163,175,0.12)",
  info: "rgba(96,165,250,0.12)",
  warn: "rgba(251,191,36,0.12)",
  error: "rgba(248,113,113,0.12)",
};

function LogItem({ entry }: { entry: LogEntry }) {
  const { colors } = useTheme();
  const levelColor = LEVEL_COLORS[entry.level];
  const levelBg = LEVEL_BG[entry.level];
  const timeLabel = entry.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <View
      style={[
        styles.logItem,
        {
          backgroundColor: colors.bg.container,
          borderColor: colors.border.default,
        },
      ]}
    >
      <View style={styles.logHeader}>
        <View style={[styles.levelBadge, { backgroundColor: levelBg }]}>
          <Text style={[styles.levelText, { color: levelColor }]}>
            {entry.level.toUpperCase()}
          </Text>
        </View>
        {entry.tag && (
          <Text style={[styles.tag, { color: colors.accent.primary }]}>
            {entry.tag}
          </Text>
        )}
        <Text style={[styles.time, { color: colors.text.tertiary }]}>
          {timeLabel}
        </Text>
      </View>
      <View style={[styles.codeBlock, { backgroundColor: colors.bg.glass }]}>
        {entry.messages.map((msg, idx) => (
          <JsonHighlighter key={idx} value={msg} />
        ))}
      </View>
    </View>
  );
}

export function LoggerScreen({ onBack }: Props) {
  const { colors } = useTheme();
  const { logs, clearLogs } = useLoggerStore();

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { borderBottomColor: colors.border.default }]}
      >
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <ChevronLeft size={20} color={colors.text.primary} />
          <Text style={[styles.backLabel, { color: colors.text.primary }]}>
            Debug
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Logger
        </Text>
        <Pressable onPress={clearLogs} hitSlop={8} style={styles.clearButton}>
          <Trash2 size={18} color={colors.status.error} />
        </Pressable>
      </View>

      {logs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No logs yet.{"\n"}Call Logger.log() anywhere in the app.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.countLabel, { color: colors.text.tertiary }]}>
            {logs.length} {logs.length === 1 ? "entry" : "entries"} (newest
            first)
          </Text>
          {logs.map((entry) => (
            <LogItem key={entry.id} entry={entry} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 48,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 64,
  },
  backLabel: { fontSize: 15, fontWeight: "500" },
  title: { fontSize: 16, fontWeight: "600" },
  clearButton: { minWidth: 64, alignItems: "flex-end" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  list: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  countLabel: { fontSize: 12, marginBottom: 4 },
  logItem: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  codeBlock: {
    borderRadius: 6,
    padding: 8,
    gap: 4,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  time: { fontSize: 11 },
  message: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
});
