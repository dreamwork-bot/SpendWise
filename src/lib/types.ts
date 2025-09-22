import type { LucideIcon } from "lucide-react";

export type Category = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: Category["value"];
};
