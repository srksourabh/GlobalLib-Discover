'use client';

import { useState, useEffect } from 'react';
import { books } from '@/lib/data';
import type { Book } from '@/lib/types';
import { SearchFilters } from '@/components/search-filters';
import { BookCard } from '@/components/book-card';
import { useSearchParams } from 'next/navigation';

// Function to shuffle an array
function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [initialBooks, setInitialBooks] = useState<Book[]>([]);

  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const mood = searchParams.get('mood') || '';

  useEffect(() => {
    // Shuffle books only on the client-side after initial mount
    setInitialBooks(shuffle([...books]));
  }, []);

  useEffect(() => {
    const filtered = initialBooks.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(search);
      const authorMatch = book.author.toLowerCase().includes(search);
      const categoryMatch = category ? book.category === category : true;
      const moodMatch = mood ? book.moodTags.includes(mood) : true;

      return (titleMatch || authorMatch) && categoryMatch && moodMatch;
    });

    setFilteredBooks(filtered);

  }, [search, category, mood, initialBooks]);

  const categories = [...new Set(books.map((book) => book.category))];
  const moodTags = [...new Set(books.flatMap((book) => book.moodTags))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Discover Your Next Read
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore our curated collection of books. Find your next favorite story
          with our smart filters and AI recommendations.
        </p>
      </div>
      <SearchFilters categories={categories} allMoodTags={moodTags} />
      <BookGrid books={filteredBooks} />
    </div>
  );
}

function BookGrid({ books }: { books: Book[] }) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center mt-8">
        <h2 className="text-xl font-semibold">No Books Found</h2>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-8">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
