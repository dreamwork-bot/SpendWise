"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { suggestExpenseCategory } from "@/ai/flows/suggest-expense-category";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import type { Transaction } from "@/lib/types";

const formSchema = z.object({
  description: z.string().min(3, "Description must be at least 3 characters."),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number." })
    .positive("Amount must be positive."),
  date: z.date({ required_error: "A date is required." }),
  category: z.string().min(1, "Please select a category."),
  type: z.enum(["expense", "income"]),
});

type FormValues = z.infer<typeof formSchema>;

type TransactionFormProps = {
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
};

export function TransactionForm({ addTransaction }: TransactionFormProps) {
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      date: new Date(),
      category: "",
      type: "expense",
    },
  });

  const description = form.watch("description");
  const transactionType = form.watch("type");
  const debouncedDescription = useDebounce(description, 500);

  async function getSuggestion(description: string) {
    if (description.length < 5 || transactionType !== "expense") {
      setSuggestion(null);
      return;
    }
    setIsSuggesting(true);
    setSuggestion(null);
    try {
      const result = await suggestExpenseCategory({
        transactionDescription: description,
      });
      if (
        result.category &&
        CATEGORIES.some((c) => c.label.toLowerCase() === result.category.toLowerCase())
      ) {
        const categoryValue =
          CATEGORIES.find(
            (c) => c.label.toLowerCase() === result.category.toLowerCase()
          )?.value ?? null;
        setSuggestion(categoryValue);
      }
    } catch (error) {
      console.error("AI suggestion failed:", error);
    } finally {
      setIsSuggesting(false);
    }
  }

  useEffect(() => {
    if (debouncedDescription) {
      getSuggestion(debouncedDescription);
    }
  }, [debouncedDescription, transactionType]);


  const onSubmit = (values: FormValues) => {
    addTransaction(values);
    form.reset({ description: '', amount: undefined, date: new Date(), category: '', type: 'expense' });
    toast({
      title: "Transaction Added",
      description: `Successfully added "${values.description}".`,
    });
  };
  
  const filteredCategories = CATEGORIES.filter(c => {
    if (transactionType === 'income') {
      return c.value === 'salary' || c.value === 'other';
    }
    return c.value !== 'salary';
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>
          Add a new income or expense to your records.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('category', '');
                      }}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Dinner with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSuggestion(null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(isSuggesting || suggestion) && transactionType === 'expense' && (
              <div className="flex items-center gap-2 text-sm">
                {isSuggesting && <Loader2 className="h-4 w-4 animate-spin" />}
                {suggestion && !isSuggesting && (
                  <>
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>AI Suggestion:</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-auto px-2 py-1"
                      onClick={() => {
                        form.setValue("category", suggestion);
                        setSuggestion(null);
                      }}
                    >
                      Use "
                      {
                        CATEGORIES.find((c) => c.value === suggestion)
                          ?.label
                      }
                      "
                    </Button>
                  </>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Transaction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
