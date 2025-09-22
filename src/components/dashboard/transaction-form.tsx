
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Sparkles, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { suggestExpenseCategory } from "@/ai/flows/suggest-expense-category";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import type { Transaction, Category } from "@/lib/types";
import { AddCategoryDialog } from './add-category-dialog';
import { defaultCategories } from '@/lib/categories';

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
  const [isAddCategoryOpen, setAddCategoryOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const allCategories = [...defaultCategories, ...customCategories];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      category: "",
      type: "expense",
      date: undefined,
    },
  });

  useEffect(() => {
    if (isClient) {
      form.setValue('date', new Date());
    }
  }, [isClient, form]);

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
        allCategories.some((c) => c.label.toLowerCase() === result.category.toLowerCase())
      ) {
        const categoryValue =
          allCategories.find(
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

  const handleAddCategory = (newCategory: Category) => {
    setCustomCategories(prev => [...prev, newCategory]);
    form.setValue('category', newCategory.value);
  }
  
  const filteredCategories = allCategories.filter(c => {
    if (transactionType === 'income') {
      return c.value === 'salary' || c.value === 'other';
    }
    return c.value !== 'salary';
  });

  return (
    <>
      <Card>
        <CardContent className="pt-6">
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
                        className="flex items-center space-x-6"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="expense" className="h-5 w-5" />
                          </FormControl>
                          <span className="text-base font-normal">Expense</span>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="income" className="h-5 w-5" />
                          </FormControl>
                          <span className="text-base font-normal">Income</span>
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
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
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
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
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
                          <Button variant="ghost" className="w-full mt-1 justify-start" onClick={(e) => { e.preventDefault(); setAddCategoryOpen(true)}}>
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                            </Button>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                          allCategories.find((c) => c.value === suggestion)
                            ?.label
                        }
                        "
                      </Button>
                    </>
                  )}
                </div>
              )}
              <Button type="submit" className="w-full bg-[#454545] text-white hover:bg-[#454545]/90 font-bold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Transaction
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AddCategoryDialog
        isOpen={isAddCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </>
  );
}
