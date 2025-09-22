// src/ai/flows/suggest-expense-category.ts
'use server';

/**
 * @fileOverview Expense category suggestion flow using a transaction description.
 *
 * - suggestExpenseCategory - Suggests an expense category based on the transaction description.
 * - SuggestExpenseCategoryInput - The input type for the suggestExpenseCategory function.
 * - SuggestExpenseCategoryOutput - The return type for the suggestExpenseCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExpenseCategoryInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type SuggestExpenseCategoryInput = z.infer<
  typeof SuggestExpenseCategoryInputSchema
>;

const SuggestExpenseCategoryOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The suggested category for the transaction, e.g., Food, Transportation, Entertainment.'
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A confidence score (0 to 1) indicating the certainty of the category suggestion.'
    ),
});
export type SuggestExpenseCategoryOutput = z.infer<
  typeof SuggestExpenseCategoryOutputSchema
>;

export async function suggestExpenseCategory(
  input: SuggestExpenseCategoryInput
): Promise<SuggestExpenseCategoryOutput> {
  return suggestExpenseCategoryFlow(input);
}

const suggestExpenseCategoryPrompt = ai.definePrompt({
  name: 'suggestExpenseCategoryPrompt',
  input: {schema: SuggestExpenseCategoryInputSchema},
  output: {schema: SuggestExpenseCategoryOutputSchema},
  prompt: `You are an expert expense categorizer. Given a transaction description, you will suggest the most appropriate expense category and a confidence score.

Transaction Description: {{{transactionDescription}}}

Respond with a JSON object containing the category and a confidence score between 0 and 1.`,
});

const suggestExpenseCategoryFlow = ai.defineFlow(
  {
    name: 'suggestExpenseCategoryFlow',
    inputSchema: SuggestExpenseCategoryInputSchema,
    outputSchema: SuggestExpenseCategoryOutputSchema,
  },
  async input => {
    const {output} = await suggestExpenseCategoryPrompt(input);
    return output!;
  }
);
