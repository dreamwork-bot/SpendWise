"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/dashboard/expense-form";
import { Summary } from "@/components/dashboard/summary";
import { Transactions } from "@/components/dashboard/transactions";
import Header from "@/components/layout/header";
import { dummyExpenses } from "@/lib/dummy-data";
import type { Expense } from "@/lib/types";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prevExpenses) => [
      { ...newExpense, id: crypto.randomUUID() },
      ...prevExpenses,
    ]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
          <div className="grid gap-4 lg:col-span-1">
            <ExpenseForm addExpense={addExpense} />
          </div>
          <div className="grid gap-4 lg:col-span-2">
            <Summary expenses={expenses} />
            <Transactions expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  );
}
