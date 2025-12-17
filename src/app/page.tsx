'use client';

import { useState, useEffect } from 'react';
import { books } from '@/lib/data';
import type { Book } from '@/lib/types';
import { SearchFilters } from '@/components/search-filters';
import { BookCard } from '@/components/book-card';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [categories, setCategories] = useState<string[]>([]);
  const [moodTags, setMoodTags] = useState<string[]>([]);

  useEffect(() => {
    setCategories([...new Set(books.map((book) => book.category))]);
    setMoodTags([...new Set(books.flatMap((book) => book.moodTags))]);
  }, []);

  const search = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';
  const mood = searchParams.get('mood') || '';

  useEffect(() => {
    const filtered = books.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(search);
      const authorMatch = book.author.toLowerCase().includes(search);
      const categoryMatch = category ? book.category === category : true;
      const moodMatch = mood ? book.moodTags.includes(mood) : true;

      return (titleMatch || authorMatch) && categoryMatch && moodMatch;
    });

    setFilteredBooks(filtered);

  }, [search, category, mood]);

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
