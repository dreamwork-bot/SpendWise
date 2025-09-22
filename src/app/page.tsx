
"use client";

import { useState } from "react";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { Summary } from "@/components/dashboard/summary";
import { Transactions } from "@/components/dashboard/transactions";
import Header from "@/components/layout/header";
import { dummyTransactions } from "@/lib/dummy-data";
import type { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);

  const addTransaction = (newTransaction: Omit<Transaction, "id">) => {
    setTransactions((prevTransactions) => [
      { ...newTransaction, id: crypto.randomUUID() },
      ...prevTransactions,
    ]);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-[22px] font-bold text-green-500">
                +৳{totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-[22px] font-bold text-red-500">
                -৳{totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-[22px] font-bold">
                ৳{balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:grid-cols-3">
          <div className="grid gap-4 lg:col-span-3">
            <TransactionForm addTransaction={addTransaction} />
          </div>
          <div className="grid auto-rows-max gap-4 md:gap-8 lg:col-span-3">
            <Summary transactions={transactions} />
            <Transactions transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
}
