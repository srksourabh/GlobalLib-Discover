import { books } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return books.map((book) => ({
    id: book.id,
  }));
}

export default function BookPage({ params }: { params: { id: string } }) {
  const book = books.find((b) => b.id === params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Link>
      <div className="grid md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-4">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              data-ai-hint={book.imageHint}
            />
          </div>
        </div>
        <div className="md:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {book.category}
          </p>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mt-2">
            {book.title}
          </h1>
          <p className="mt-2 text-xl text-muted-foreground">by {book.author}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {book.moodTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="mt-6 text-base leading-relaxed text-foreground/80">
            {book.description}
          </p>

          <Button asChild className="mt-6">
            <a href={book.affiliateLink} target="_blank" rel="noopener noreferrer">
              Buy Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <h2 className="font-headline text-3xl font-bold border-b pb-4">
          Full Text
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none mt-6 space-y-4 text-foreground/90">
            {book.fullText.split('\\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>
    </div>
  );
}
