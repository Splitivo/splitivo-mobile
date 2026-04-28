import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle, Clock, AlertCircle } from "lucide-react-native";
import { useTheme } from "../../core/theme";

type StatusType = "settled" | "pending" | "partial";

interface StatusPillProps {
  status: StatusType;
}

export function StatusPill({ status }: StatusPillProps) {
  const { colors } = useTheme();

  const statusConfig = {
    settled: {
      label: "Settled",
      Icon: CheckCircle,
      bg: colors.status.success + "20",
      color: colors.status.success,
    },
    pending: {
      label: "Pending",
      Icon: Clock,
      bg: colors.status.warning + "20",
      color: colors.status.warning,
    },
    partial: {
      label: "Partial",
      Icon: AlertCircle,
      bg: colors.status.info + "20",
      color: colors.status.info,
    },
  }[status];

  const config = statusConfig;

  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]}>
      <config.Icon size={14} color={config.color} style={styles.icon} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 2,
  },
  text: {
    fontSize: 11,
    fontFamily: "Geist_600SemiBold",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
