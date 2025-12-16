'use server';
/**
 * @fileOverview AI-powered book recommendations flow.
 *
 * This file defines a Genkit flow that recommends books based on user reading history and preferences.
 * It includes:
 * - `recommendBooks`: The main function to trigger book recommendations.
 * - `RecommendBooksInput`: The input type for the `recommendBooks` function.
 * - `RecommendBooksOutput`: The output type for the `recommendBooks` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodTagSchema = z.enum([
  'Inspiring',
  'Sad',
  'Educational',
  'Funny',
  'Suspenseful',
  'Romantic',
  'Adventurous',
  'Dark',
  'Lighthearted',
]);

const RecommendBooksInputSchema = z.object({
  readingHistory: z
    .string()
    .describe(
      'A description of the user reading history and preferences, including genres, authors, and themes they enjoy.'
    ),
});
export type RecommendBooksInput = z.infer<typeof RecommendBooksInputSchema>;

const RecommendBooksOutputSchema = z.object({
  recommendedMoodTags: z
    .array(MoodTagSchema)
    .describe(
      'A list of mood tags that best match the users described reading history.'
    ),
});
export type RecommendBooksOutput = z.infer<typeof RecommendBooksOutputSchema>;

export async function recommendBooks(input: RecommendBooksInput): Promise<RecommendBooksOutput> {
  return recommendBooksFlow(input);
}

const recommendBooksPrompt = ai.definePrompt({
  name: 'recommendBooksPrompt',
  input: {schema: RecommendBooksInputSchema},
  output: {schema: RecommendBooksOutputSchema},
  prompt: `Based on the following reading history and preferences:

  {{readingHistory}}

  Suggest mood tags that the user would enjoy.  Return a JSON array of mood tags.
  Valid mood tags:
  [Inspiring, Sad, Educational, Funny, Suspenseful, Romantic, Adventurous, Dark, Lighthearted]
  `,
});

const recommendBooksFlow = ai.defineFlow(
  {
    name: 'recommendBooksFlow',
    inputSchema: RecommendBooksInputSchema,
    outputSchema: RecommendBooksOutputSchema,
  },
  async input => {
    const {output} = await recommendBooksPrompt(input);
    return output!;
  }
);
