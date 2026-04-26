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

// Dark theme — pocket-companion design system
// Deep purple-grey backgrounds, violet accent, glass surfaces
const darkColors: ThemeColors = {
  bg: {
    primary: "#1A1721",
    elevated: "#22202D",
    container: "rgba(58, 53, 80, 0.55)",
    card: "rgba(58, 53, 80, 0.55)",
    cardPressed: "rgba(68, 62, 96, 0.82)",
    sheet: "rgba(24, 22, 36, 0.90)",
    sheetGlass: "rgba(10, 8, 18, 0.72)",
    tabBar: "rgba(30, 27, 45, 0.78)",
    input: "rgba(255, 255, 255, 0.06)",
    glass: "rgba(58, 53, 80, 0.55)",
    glassStrong: "rgba(68, 62, 96, 0.75)",
  },
  border: {
    default: "rgba(255, 255, 255, 0.08)",
    active: "#8B5CF6",
  },
  accent: {
    primary: "#8B5CF6",
    pressed: "#7C3AED",
    secondary: "#A78BFA",
  },
  status: {
    success: "#34C77A",
    warning: "#F0B429",
    error: "#EF4444",
    info: "#60A5FA",
  },
  text: {
    primary: "#FAF9FD",
    secondary: "#C2BDD2",
    tertiary: "#7D788C",
    onAccent: "#FFFFFF",
    destructive: "#F87171",
  },
  icon: {
    primary: "#E8E4F2",
    secondary: "#7D788C",
  },
  skeleton: {
    base: "rgba(58, 53, 80, 0.5)",
    highlight: "rgba(80, 74, 108, 0.5)",
  },
  overlay: "rgba(0, 0, 0, 0.6)",
};

// Light theme — white backgrounds, violet accent
const lightColors: ThemeColors = {
  bg: {
    primary: "#F8F7FC",
    elevated: "#FFFFFF",
    container: "rgba(255, 255, 255, 0.65)",
    card: "rgba(255, 255, 255, 0.65)",
    cardPressed: "rgba(245, 243, 255, 0.9)",
    sheet: "rgba(255, 255, 255, 0.92)",
    sheetGlass: "rgba(180, 170, 210, 0.0)",
    tabBar: "rgba(255, 255, 255, 0.80)",
    input: "rgba(0, 0, 0, 0.06)",
    glass: "rgba(255, 255, 255, 0.1)",
    glassStrong: "rgba(255, 255, 255, 0.85)",
  },
  border: {
    default: "rgba(0, 0, 0, 0.10)",
    active: "#6D28D9",
  },
  accent: {
    primary: "#6D28D9",
    pressed: "#5B21B6",
    secondary: "#8B5CF6",
  },
  status: {
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
    info: "#2563EB",
  },
  text: {
    primary: "#1A1721",
    secondary: "#4B4763",
    tertiary: "#8A8598",
    onAccent: "#FFFFFF",
    destructive: "#DC2626",
  },
  icon: {
    primary: "#27232E",
    secondary: "#8A8598",
  },
  skeleton: {
    base: "rgba(220, 216, 235, 0.6)",
    highlight: "rgba(240, 238, 250, 0.8)",
  },
  overlay: "rgba(0, 0, 0, 0.4)",
};

// Category colors — matches pocket-companion's oklch palette (hex approximations)
export const categoryColors = {
  foodDining: "#D4A84B",
  entertainment: "#C44CC2",
  transport: "#5B9BF5",
  shopping: "#F24271",
  groceries: "#34CB77",
  utilities: "#20C9C0",
  other: "#8B84A0",
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
