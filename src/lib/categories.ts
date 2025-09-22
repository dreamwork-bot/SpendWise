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
  { value: "food", label: "Food", icon: UtensilsCrossed },
  { value: "transport", label: "Transport", icon: TrainFront },
  { value: "entertainment", label: "Entertainment", icon: Popcorn },
  { value: "housing", label: "Housing", icon: Home },
  { value: "health", label: "Health", icon: HeartPulse },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "bills", label: "Bills", icon: ReceiptText },
  { value: "salary", label: "Salary", icon: Briefcase },
  { value: "other", label: "Other", icon: Landmark },
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
