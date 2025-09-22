import type { Transaction } from "./types";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);

export const dummyTransactions: Transaction[] = [
  {
    id: "1",
    description: "Morning Coffee",
    amount: 4.5,
    date: today,
    category: "food",
    type: "expense",
  },
  {
    id: "2",
    description: "Train ticket",
    amount: 2.75,
    date: today,
    category: "transport",
    type: "expense",
  },
  {
    id: "3",
    description: "Lunch with colleagues",
    amount: 15.0,
    date: yesterday,
    category: "food",
    type: "expense",
  },
  {
    id: "4",
    description: "Movie night",
    amount: 25.0,
    date: yesterday,
    category: "entertainment",
    type: "expense",
  },
  {
    id: "5",
    description: "Groceries for the week",
    amount: 75.2,
    date: lastWeek,
    category: "food",
    type: "expense",
  },
  {
    id: "6",
    description: "Electricity Bill",
    amount: 55.0,
    date: lastWeek,
    category: "bills",
    type: "expense",
  },
  {
    id: "7",
    description: "New pair of shoes",
    amount: 120.0,
    date: lastWeek,
    category: "shopping",
    type: "expense",
  },
  {
    id: "8",
    description: "Monthly Salary",
    amount: 3000.0,
    date: lastMonth,
    category: "salary",
    type: "income",
  },
];
