import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/lib/types';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className="group block h-full">
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="aspect-[2/3] relative w-full">
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 17vw"
              data-ai-hint={book.imageHint}
            />
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary flex-grow">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}