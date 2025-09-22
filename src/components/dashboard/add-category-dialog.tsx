
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconMap, availableIcons, IconName } from "@/lib/categories";
import type { Category } from "@/lib/types";

const formSchema = z.object({
  label: z.string().min(2, "Category name must be at least 2 characters."),
  icon: z.string().min(1, "Please select an icon."),
});

type FormValues = z.infer<typeof formSchema>;

type AddCategoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: Category) => void;
};

export function AddCategoryDialog({
  isOpen,
  onClose,
  onAddCategory,
}: AddCategoryDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      icon: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    const newCategory: Category = {
      label: values.label,
      value: values.label.toLowerCase().replace(/\s/g, "-"),
      icon: iconMap[values.icon as IconName] || iconMap.Shapes,
    };
    onAddCategory(newCategory);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Category</DialogTitle>
          <DialogDescription>
            Create a custom category for your transactions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Subscriptions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableIcons.map((iconName) => {
                        const Icon = iconMap[iconName as IconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              {iconName}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
