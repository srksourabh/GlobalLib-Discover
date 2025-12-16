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
    <Link href={`/books/${book.id}`} className="group block">
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              data-ai-hint={book.imageHint}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
