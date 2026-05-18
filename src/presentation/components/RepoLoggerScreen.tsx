import React, { useState } from "react";
import {
  Clipboard,
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  ChevronLeft,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react-native";
import { useTheme } from "../../core/theme";
import { useRepoLoggerStore, RepoLogEntry } from "../stores/useRepoLoggerStore";
import { JsonHighlighter } from "./JsonHighlighter";
import { toast } from "sonner-native";

interface Props {
  onBack: () => void;
}

function LogItem({ entry, colors }: { entry: RepoLogEntry; colors: any }) {
  const [expanded, setExpanded] = useState(false);
  const hasError = !!entry.error;

  const timeLabel = entry.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleLongPress = () => {
    const parts: string[] = [
      `${entry.repoClass}.${entry.functionName}() — ${timeLabel} (${entry.durationMs}ms)`,
    ];
    if (entry.parameters.length > 0) {
      parts.push(
        "Parameters:\n" +
          entry.parameters
            .map((p) =>
              typeof p === "string" ? p : JSON.stringify(p, null, 2),
            )
            .join("\n"),
      );
    }
    if (hasError) {
      parts.push(
        "Error:\n" +
          (typeof entry.error === "string"
            ? entry.error
            : JSON.stringify(entry.error, null, 2)),
      );
    } else {
      parts.push(
        "Response:\n" +
          (typeof entry.response === "string"
            ? entry.response
            : JSON.stringify(entry.response, null, 2)),
      );
    }
    Clipboard.setString(parts.join("\n\n"));
    toast.success("Copied to clipboard");
  };

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      onLongPress={handleLongPress}
      delayLongPress={400}
      style={[
        styles.logItem,
        {
          backgroundColor: colors.bg.container,
          borderColor: hasError ? colors.status.error : colors.border.default,
        },
      ]}
    >
      <View style={styles.logHeader}>
        <View style={styles.logMeta}>
          <Text style={[styles.repoClass, { color: colors.accent.primary }]}>
            {entry.repoClass}
          </Text>
          <Text style={[styles.dot, { color: colors.text.tertiary }]}>·</Text>
          <Text style={[styles.fnName, { color: colors.text.primary }]}>
            {entry.functionName}()
          </Text>
        </View>
        <View style={styles.logRight}>
          <Text style={[styles.duration, { color: colors.text.tertiary }]}>
            {entry.durationMs}ms
          </Text>
          <Text style={[styles.time, { color: colors.text.tertiary }]}>
            {timeLabel}
          </Text>
          {expanded ? (
            <ChevronDown size={14} color={colors.text.tertiary} />
          ) : (
            <ChevronRight size={14} color={colors.text.tertiary} />
          )}
        </View>
      </View>

      {expanded && (
        <View style={styles.logBody}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
            Parameters
          </Text>
          <View
            style={[styles.codeBlock, { backgroundColor: colors.bg.glass }]}
          >
            {entry.parameters.length === 0 ? (
              <JsonHighlighter value="(none)" />
            ) : (
              entry.parameters.map((p, i) => (
                <JsonHighlighter key={i} value={p} />
              ))
            )}
          </View>

          {hasError ? (
            <>
              <Text
                style={[styles.sectionLabel, { color: colors.status.error }]}
              >
                Error
              </Text>
              <View
                style={[styles.codeBlock, { backgroundColor: colors.bg.glass }]}
              >
                <JsonHighlighter value={entry.error} />
              </View>
            </>
          ) : (
            <>
              <Text
                style={[styles.sectionLabel, { color: colors.text.secondary }]}
              >
                Response
              </Text>
              <View
                style={[styles.codeBlock, { backgroundColor: colors.bg.glass }]}
              >
                <JsonHighlighter value={entry.response} />
              </View>
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}

export function RepoLoggerScreen({ onBack }: Props) {
  const { colors } = useTheme();
  const { logs, clearLogs } = useRepoLoggerStore();

  return (
    <View style={styles.container}>
      {/* Header */}
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
          Repo Logger
        </Text>
        <Pressable onPress={clearLogs} hitSlop={8} style={styles.clearButton}>
          <Trash2 size={18} color={colors.status.error} />
        </Pressable>
      </View>

      {logs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
            No repo calls logged yet.{"\n"}Interact with the app to see logs
            here.
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
            <LogItem key={entry.id} entry={entry} colors={colors} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  backLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    minWidth: 64,
    alignItems: "flex-end",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  countLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  logItem: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  logMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    flexWrap: "wrap",
  },
  repoClass: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Geist_600SemiBold",
  },
  dot: {
    fontSize: 12,
  },
  fnName: {
    fontSize: 13,
    fontWeight: "500",
  },
  logRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  duration: {
    fontSize: 11,
  },
  time: {
    fontSize: 11,
  },
  logBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  codeBlock: {
    padding: 8,
    borderRadius: 6,
    overflow: "hidden",
    gap: 4,
  },
});
