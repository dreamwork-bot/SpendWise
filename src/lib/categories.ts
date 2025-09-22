import {
  Briefcase,
  HeartPulse,
  Home,
  Landmark,
  Popcorn,
  ReceiptText,
  ShoppingBag,
  TrainFront,
  UtensilsCrossed,
  Shapes,
} from "lucide-react";

import type { Category } from "./types";

export const defaultCategories: Category[] = [
  { value: "food", label: "Food", icon: UtensilsCrossed, color: "#ef4444" },
  { value: "transport", label: "Transport", icon: TrainFront, color: "#f97316" },
  { value: "entertainment", label: "Entertainment", icon: Popcorn, color: "#eab308" },
  { value: "housing", label: "Housing", icon: Home, color: "#84cc16" },
  { value: "health", label: "Health", icon: HeartPulse, color: "#22c55e" },
  { value: "shopping", label: "Shopping", icon: ShoppingBag, color: "#14b8a6" },
  { value: "bills", label: "Bills", icon: ReceiptText, color: "#3b82f6" },
  { value: "salary", label: "Salary", icon: Briefcase, color: "#8b5cf6" },
  { value: "other", label: "Other", icon: Landmark, color: "#64748b" },
];

export const iconMap = {
  Briefcase,
  HeartPulse,
  Home,
  Landmark,
  Popcorn,
  ReceiptText,
  ShoppingBag,
  TrainFront,
  UtensilsCrossed,
  Shapes,
};

export const availableIcons = Object.keys(iconMap);

export type IconName = keyof typeof iconMap;
