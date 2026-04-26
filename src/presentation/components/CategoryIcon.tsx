import React from "react";
import {
  UtensilsCrossed,
  Clapperboard,
  Car,
  ShoppingBag,
  Apple,
  Lightbulb,
  Sparkles,
  MapPin,
  DollarSign,
} from "lucide-react-native";
import { CATEGORY_META } from "../../core/theme";
import type { ExpenseCategory } from "../../domain/entities/expense";

const ICON_MAP = {
  UtensilsCrossed,
  Clapperboard,
  Car,
  ShoppingBag,
  Apple,
  Lightbulb,
  Sparkles,
  DollarSign,
} as const;

export function CategoryIcon({
  category,
  size = 24,
  color,
}: {
  category: ExpenseCategory | undefined;
  size?: number;
  color: string;
}) {
  if (!category) {
    const DollarIcon = ICON_MAP.DollarSign;
    return <DollarIcon size={size} color={color} strokeWidth={2} />;
  }

  const meta = CATEGORY_META[category];
  if (!meta) {
    const DollarIcon = ICON_MAP.DollarSign;
    return <DollarIcon size={size} color={color} strokeWidth={2} />;
  }

  const IconComponent = ICON_MAP[meta.icon as keyof typeof ICON_MAP];
  if (!IconComponent) {
    const DollarIcon = ICON_MAP.DollarSign;
    return <DollarIcon size={size} color={color} strokeWidth={2} />;
  }

  return <IconComponent size={size} color={color} strokeWidth={2} />;
}

export function TripIcon({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) {
  return <MapPin size={size} color={color} strokeWidth={2} />;
}
