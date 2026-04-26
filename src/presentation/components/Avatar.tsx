import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../core/theme";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Deterministic gradient start colors — matching pocket-companion gradient presets
const AVATAR_COLORS = [
  "#8B5CF6", // violet
  "#38BDF8", // sky → indigo
  "#34D399", // emerald → teal
  "#FBBF24", // amber → orange
  "#FB7185", // rose → pink
  "#22D3EE", // cyan → blue
] as const;

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function Avatar({ name, imageUrl, size = 40 }: AvatarProps) {
  const { colors } = useTheme();
  const bgColor = getAvatarColor(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
          borderWidth: 2,
          borderColor: colors.bg.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.38,
            color: "#FFFFFF",
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

interface StackedAvatarsProps {
  names: string[];
  max?: number;
  size?: number;
}

export function StackedAvatars({
  names,
  max = 3,
  size = 28,
}: StackedAvatarsProps) {
  const displayed = names.slice(0, max);
  const remaining = names.length - max;
  const { colors } = useTheme();

  return (
    <View style={styles.stacked}>
      {displayed.map((name, i) => (
        <View
          key={i}
          style={[
            styles.stackedItem,
            { marginLeft: i > 0 ? -(size * 0.35) : 0, zIndex: max - i },
          ]}
        >
          <Avatar name={name} size={size} />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.remainingBadge,
            {
              marginLeft: -(size * 0.35),
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.bg.elevated,
              borderWidth: 2,
              borderColor: colors.bg.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.remainingText,
              { color: colors.text.secondary, fontSize: size * 0.32 },
            ]}
          >
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
  },
  stacked: {
    flexDirection: "row",
    alignItems: "center",
  },
  stackedItem: {
    borderRadius: 100,
  },
  remainingBadge: {
    alignItems: "center",
    justifyContent: "center",
  },
  remainingText: {
    fontWeight: "600",
  },
});
