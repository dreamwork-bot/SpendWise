import type { LucideIcon } from "lucide-react";

export type Category = {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: Category["value"];
  type: "income" | "expense";
};
