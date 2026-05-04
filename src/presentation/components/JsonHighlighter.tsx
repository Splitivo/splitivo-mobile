import React from "react";
import { Text, View, StyleSheet } from "react-native";

/**
 * Syntax-highlight a JSON string by tokenizing it into colored spans.
 * Colors follow a standard dark-theme palette that reads well on any bg.
 */

const COLORS = {
  key: "#7DD3FC", // light blue  – object keys
  string: "#86EFAC", // green       – string values
  number: "#FCA5A5", // red-ish     – number values
  boolean: "#FDBA74", // orange      – true / false
  null: "#C4B5FD", // purple      – null
  punctuation: "#94A3B8", // slate    – braces / brackets / colon / comma
};

type Token = { type: keyof typeof COLORS | "plain"; value: string };

// Very lightweight JSON tokenizer (no full parser — works on valid JSON strings)
function tokenize(json: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < json.length) {
    // Whitespace / newlines — keep as plain
    if (/\s/.test(json[i])) {
      let ws = "";
      while (i < json.length && /\s/.test(json[i])) ws += json[i++];
      tokens.push({ type: "plain", value: ws });
      continue;
    }

    // String
    if (json[i] === '"') {
      let str = '"';
      i++;
      while (i < json.length) {
        if (json[i] === "\\" && i + 1 < json.length) {
          str += json[i] + json[i + 1];
          i += 2;
        } else if (json[i] === '"') {
          str += '"';
          i++;
          break;
        } else {
          str += json[i++];
        }
      }
      // Peek ahead to decide key vs value
      let j = i;
      while (j < json.length && /\s/.test(json[j])) j++;
      const isKey = json[j] === ":";
      tokens.push({ type: isKey ? "key" : "string", value: str });
      continue;
    }

    // Numbers
    const numMatch = json.slice(i).match(/^-?\d+(\.\d+)?([eE][+-]?\d+)?/);
    if (numMatch) {
      tokens.push({ type: "number", value: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    // true / false / null
    if (json.startsWith("true", i)) {
      tokens.push({ type: "boolean", value: "true" });
      i += 4;
      continue;
    }
    if (json.startsWith("false", i)) {
      tokens.push({ type: "boolean", value: "false" });
      i += 5;
      continue;
    }
    if (json.startsWith("null", i)) {
      tokens.push({ type: "null", value: "null" });
      i += 4;
      continue;
    }

    // Punctuation: { } [ ] : ,
    tokens.push({ type: "punctuation", value: json[i++] });
  }

  return tokens;
}

function tryPrettify(value: unknown): { json: string; isJson: boolean } {
  if (typeof value === "string") {
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(value);
      return { json: JSON.stringify(parsed, null, 2), isJson: true };
    } catch {
      return { json: value, isJson: false };
    }
  }
  if (value === null || value === undefined) {
    return { json: String(value), isJson: false };
  }
  if (
    typeof value === "object" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    try {
      return { json: JSON.stringify(value, null, 2), isJson: true };
    } catch {
      return { json: String(value), isJson: false };
    }
  }
  return { json: String(value), isJson: false };
}

interface Props {
  value: unknown;
  style?: object;
}

export function JsonHighlighter({ value, style }: Props) {
  const { json, isJson } = tryPrettify(value);

  if (!isJson) {
    return (
      <Text style={[styles.base, { color: COLORS.string }, style]}>{json}</Text>
    );
  }

  const tokens = tokenize(json);

  return (
    <View style={style}>
      <Text style={styles.base}>
        {tokens.map((token, idx) => (
          <Text
            key={idx}
            style={
              token.type === "plain" ? undefined : { color: COLORS[token.type] }
            }
          >
            {token.value}
          </Text>
        ))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
    color: "#94A3B8",
  },
});
