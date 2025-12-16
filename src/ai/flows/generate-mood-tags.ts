'use server';

/**
 * @fileOverview A Genkit flow that generates mood tags for a given book description.
 *
 * - generateMoodTags - A function that generates mood tags for a book description.
 * - GenerateMoodTagsInput - The input type for the generateMoodTags function.
 * - GenerateMoodTagsOutput - The return type for the generateMoodTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodTagsInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the book to generate mood tags for.'),
});

export type GenerateMoodTagsInput = z.infer<typeof GenerateMoodTagsInputSchema>;

const GenerateMoodTagsOutputSchema = z.object({
  moodTags: z
    .array(z.string())
    .describe('An array of mood tags that describe the book.'),
});

export type GenerateMoodTagsOutput = z.infer<typeof GenerateMoodTagsOutputSchema>;

export async function generateMoodTags(input: GenerateMoodTagsInput): Promise<GenerateMoodTagsOutput> {
  return generateMoodTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoodTagsPrompt',
  input: {schema: GenerateMoodTagsInputSchema},
  output: {schema: GenerateMoodTagsOutputSchema},
  prompt: `You are an expert at identifying the emotional tone of books.

  Given the following book description, generate a list of mood tags that describe the book's emotional tone.
  The mood tags should be short, descriptive, and relevant to the book's content.

  Description: {{{description}}}
  `,
});

const generateMoodTagsFlow = ai.defineFlow(
  {
    name: 'generateMoodTagsFlow',
    inputSchema: GenerateMoodTagsInputSchema,
    outputSchema: GenerateMoodTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
