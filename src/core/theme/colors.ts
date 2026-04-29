export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  bg: {
    primary: string;
    elevated: string;
    container: string;
    card: string;
    cardPressed: string;
    sheet: string;
    sheetGlass: string;
    tabBar: string;
    input: string;
    glass: string;
    glassStrong: string;
  };
  border: {
    default: string;
    active: string;
  };
  accent: {
    primary: string;
    pressed: string;
    secondary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    onAccent: string;
    destructive: string;
  };
  icon: {
    primary: string;
    secondary: string;
  };
  skeleton: {
    base: string;
    highlight: string;
  };
  overlay: string;
}

// Dark theme — monochrome, true-black foundation, white accent
const darkColors: ThemeColors = {
  bg: {
    primary: "#090909",
    elevated: "#141414",
    container: "rgba(255, 255, 255, 0.05)",
    card: "rgba(255, 255, 255, 0.05)",
    cardPressed: "rgba(255, 255, 255, 0.09)",
    sheet: "rgba(10, 10, 10, 0.94)",
    sheetGlass: "rgba(0, 0, 0, 0.68)",
    tabBar: "rgba(9, 9, 9, 0.88)",
    input: "rgba(255, 255, 255, 0.07)",
    glass: "rgba(255, 255, 255, 0.05)",
    glassStrong: "rgba(255, 255, 255, 0.10)",
  },
  border: {
    default: "rgba(255, 255, 255, 0.10)",
    active: "#FFFFFF",
  },
  accent: {
    primary: "#FFFFFF",
    pressed: "rgba(255, 255, 255, 0.80)",
    secondary: "rgba(255, 255, 255, 0.50)",
  },
  status: {
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.60)",
    tertiary: "rgba(255, 255, 255, 0.34)",
    onAccent: "#000000",
    destructive: "#F87171",
  },
  icon: {
    primary: "#FFFFFF",
    secondary: "rgba(255, 255, 255, 0.38)",
  },
  skeleton: {
    base: "rgba(255, 255, 255, 0.07)",
    highlight: "rgba(255, 255, 255, 0.13)",
  },
  overlay: "rgba(0, 0, 0, 0.72)",
};

// Light theme — pure white, near-black accent
const lightColors: ThemeColors = {
  bg: {
    primary: "#FAFAFA",
    elevated: "#FFFFFF",
    container: "rgba(0, 0, 0, 0.03)",
    card: "rgba(255, 255, 255, 0.82)",
    cardPressed: "rgba(0, 0, 0, 0.04)",
    sheet: "rgba(250, 250, 250, 0.96)",
    sheetGlass: "rgba(255, 255, 255, 8)",
    tabBar: "rgba(255, 255, 255, 0.88)",
    input: "rgba(0, 0, 0, 0.04)",
    glass: "rgba(255, 255, 255, 0.60)",
    glassStrong: "rgba(255, 255, 255, 0.92)",
  },
  border: {
    default: "rgba(0, 0, 0, 0.08)",
    active: "#0A0A0A",
  },
  accent: {
    primary: "#0A0A0A",
    pressed: "#2A2A2A",
    secondary: "#525252",
  },
  status: {
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
  },
  text: {
    primary: "#0A0A0A",
    secondary: "#525252",
    tertiary: "#A3A3A3",
    onAccent: "#FFFFFF",
    destructive: "#DC2626",
  },
  icon: {
    primary: "#0A0A0A",
    secondary: "#A3A3A3",
  },
  skeleton: {
    base: "rgba(0, 0, 0, 0.06)",
    highlight: "rgba(0, 0, 0, 0.03)",
  },
  overlay: "rgba(0, 0, 0, 0.42)",
};

// Category colors — vibrant, semantic, high-contrast on both themes
export const categoryColors = {
  foodDining: "#F59E0B",
  entertainment: "#A855F7",
  transport: "#3B82F6",
  shopping: "#EC4899",
  groceries: "#22C55E",
  utilities: "#06B6D4",
  other: "#94A3B8",
} as const;

// Category metadata with icon, label, and color — for UI display
export const CATEGORY_META = {
  food_dining: {
    label: "Food & Dining",
    icon: "UtensilsCrossed",
    color: categoryColors.foodDining,
  },
  entertainment: {
    label: "Entertainment",
    icon: "Clapperboard",
    color: categoryColors.entertainment,
  },
  transport: {
    label: "Transport",
    icon: "Car",
    color: categoryColors.transport,
  },
  shopping: {
    label: "Shopping",
    icon: "ShoppingBag",
    color: categoryColors.shopping,
  },
  groceries: {
    label: "Groceries",
    icon: "Apple",
    color: categoryColors.groceries,
  },
  utilities: {
    label: "Utilities",
    icon: "Lightbulb",
    color: categoryColors.utilities,
  },
  other: {
    label: "Other",
    icon: "Sparkles",
    color: categoryColors.other,
  },
} as const;

export const themes = {
  dark: darkColors,
  light: lightColors,
} as const;

export const getThemeColors = (mode: "dark" | "light"): ThemeColors => {
  return themes[mode];
};
