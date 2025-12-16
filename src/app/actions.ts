'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { books } from '@/lib/data';
import type { Book } from '@/lib/types';

export async function getGeminiRecommendations(
  userMood: string
): Promise<{ books: Book[] | null; error: string | null }> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      books: null,
      error:
        'API key not found. Please set the GEMINI_API_KEY environment variable.',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Here is a list of book data: ${JSON.stringify(
      books.map(({ id, title, author, description, category, moodTags }) => ({
        id,
        title,
        author,
        description,
        category,
        moodTags,
      }))
    )}. The user feels: '${userMood}'. Return a JSON array containing ONLY the 'id' strings of the 3 best matching books. Do not write any markdown, explanation, or surrounding text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const recommendedIds = JSON.parse(jsonString) as string[];

    if (!Array.isArray(recommendedIds)) {
        throw new Error("AI did not return a valid array of book IDs.");
    }

    const recommendedBooks = books.filter((book) =>
      recommendedIds.includes(book.id)
    );

    return { books: recommendedBooks, error: null };
  } catch (e: any) {
    console.error('Error fetching recommendations from Gemini:', e);
    return {
      books: null,
      error:
        'Failed to get recommendations from AI. The model may have returned an unexpected format.',
    };
  }
}
