
"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Transaction } from "@/lib/types";
import { useMemo } from "react";
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { defaultCategories } from "@/lib/categories";

type SummaryProps = {
  transactions: Transaction[];
};

const chartConfig = Object.fromEntries(
  defaultCategories.map((cat, i) => [
    cat.value,
    { label: cat.label, color: `hsl(var(--chart-${(i % 5) + 1}))` },
  ])
) satisfies ChartConfig;

export function Summary({ transactions }: SummaryProps) {
  const now = new Date();

  const timeRanges = {
    daily: {
      start: startOfDay(now),
      end: endOfDay(now),
    },
    weekly: {
      start: startOfWeek(now),
      end: endOfWeek(now),
    },
    monthly: {
      start: startOfMonth(now),
      end: endOfMonth(now),
    },
  };

  const getFilteredData = (period: "daily" | "weekly" | "monthly") => {
    const { start, end } = timeRanges[period];
    const filteredExpenses = transactions.filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.date >= start &&
        transaction.date <= end
    );

    const total = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    const chartData = Object.entries(
      filteredExpenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([category, amount]) => ({
      category,
      amount: parseFloat(amount.toFixed(2)),
    }));

    return { total, chartData };
  };

  const dailyData = useMemo(() => getFilteredData("daily"), [transactions]);
  const weeklyData = useMemo(() => getFilteredData("weekly"), [transactions]);
  const monthlyData = useMemo(() => getFilteredData("monthly"), [transactions]);

  const SummaryContent = ({
    total,
    chartData,
  }: {
    total: number;
    chartData: { category: string; amount: number }[];
  }) => (
    <div className="space-y-4">
      <div className="text-2xl font-bold">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[200px] w-full min-w-0">
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={4}
                      textAnchor="end"
                      fill="#666"
                      fontSize={12}
                    >
                      {chartConfig[payload.value]?.label}
                    </text>
                  </g>
                )}
                width={80}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="amount" layout="vertical" radius={5}>
                {chartData.map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    dataKey="amount"
                    fill={chartConfig[entry.category]?.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      ) : (
        <p className="text-sm text-muted-foreground">No expenses for this period.</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
        <CardDescription>
          Your spending trends at a glance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
            <SummaryContent total={dailyData.total} chartData={dailyData.chartData} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
            <SummaryContent total={weeklyData.total} chartData={weeklyData.chartData} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-4">
            <SummaryContent total={monthlyData.total} chartData={monthlyData.chartData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
