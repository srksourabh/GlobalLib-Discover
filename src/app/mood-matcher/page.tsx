'use client';

import { useState } from 'react';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { books } from '@/lib/data';
import type { Book } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function MoodMatcherPage() {
  const [mood, setMood] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGetRecommendations = () => {
    setHasSearched(true);
    const lowerCaseMood = mood.toLowerCase();
    let results: Book[] = [];

    if (lowerCaseMood.includes('sad') || lowerCaseMood.includes('down')) {
      results = books.filter(
        (book) =>
          book.moodTags.includes('Inspiring') ||
          book.moodTags.includes('Funny') ||
          book.moodTags.includes('Lighthearted')
      );
    } else if (
      lowerCaseMood.includes('ambitious') ||
      lowerCaseMood.includes('work')
    ) {
      results = books.filter((book) => book.category === 'Business');
    } else {
      // Return a random selection of 4 books for generic input
      const shuffled = [...books].sort(() => 0.5 - Math.random());
      results = shuffled.slice(0, 4);
    }

    setRecommendedBooks(results);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        How are you feeling today?
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Describe your mood, and we'll find the perfect book for you.
      </p>

      <div className="mt-8 grid w-full gap-4">
        <Textarea
          id="mood-input"
          placeholder="e.g., I'm feeling a bit down and need something inspiring."
          className="col-span-3"
          rows={4}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <Button onClick={handleGetRecommendations} size="lg">
          Get AI Recommendations
        </Button>
      </div>

      {hasSearched && (
        <div className="mt-12">
          {recommendedBooks.length > 0 ? (
            <BookGrid books={recommendedBooks} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h2 className="text-xl font-semibold">No Matches Found</h2>
              <p className="mt-2 text-muted-foreground">
                We couldn't find any books for that mood. Try another search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 mt-8">
      {books.map((book) => (
        <div key={book.id} className="relative">
          <BookCard book={book} />
          <Badge className="absolute top-2 right-2" variant="destructive">
            AI Suggested
          </Badge>
        </div>
      ))}
    </div>
  );
}