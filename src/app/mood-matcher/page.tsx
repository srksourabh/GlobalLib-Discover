'use client';

import { useState } from 'react';
import { BookCard } from '@/components/book-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Book } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { getGeminiRecommendations } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function MoodMatcherPage() {
  const [mood, setMood] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!mood.trim()) {
      toast({
        title: 'Please describe your mood',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setHasSearched(true);
    setRecommendedBooks([]);

    const result = await getGeminiRecommendations(mood);

    if (result.error) {
      toast({
        title: 'Error getting recommendations',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.books) {
      setRecommendedBooks(result.books);
    }
    
    setLoading(false);
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
          disabled={loading}
        />
        <Button onClick={handleGetRecommendations} size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting AI Recommendations...
            </>
          ) : (
            'Get AI Recommendations'
          )}
        </Button>
      </div>

      {hasSearched && !loading && (
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
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 mt-8">
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
