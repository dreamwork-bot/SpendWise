import {
  HeartPulse,
  Home,
  Landmark,
  Popcorn,
  ReceiptText,
  ShoppingBag,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";

import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { value: "food", label: "Food", icon: UtensilsCrossed },
  { value: "transport", label: "Transport", icon: TrainFront },
  { value: "entertainment", label: "Entertainment", icon: Popcorn },
  { value: "housing", label: "Housing", icon: Home },
  { value: "health", label: "Health", icon: HeartPulse },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "bills", label: "Bills", icon: ReceiptText },
  { value: "other", label: "Other", icon: Landmark },
];
