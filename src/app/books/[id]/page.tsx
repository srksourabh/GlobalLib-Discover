'use client';

import { useState, useEffect } from 'react';
import { books } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Play, Square, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function BookPage({ params: { id } }: { params: { id: string } }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const book = books.find((b) => b.id === id);

  useEffect(() => {
    // Cleanup speechSynthesis on component unmount
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!book) {
    notFound();
  }

  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(book.fullText.replace(/\\n/g, ' '));
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };
  
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleShowSummary = () => {
    alert(`Quick Summary:\n\n${book.description}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Link>
      <div className="grid md:grid-cols-10 gap-8 md:gap-12">
        {/* Left Side */}
        <div className="md:col-span-3">
          <div className="sticky top-24">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
                data-ai-hint={book.imageHint}
              />
            </div>
            <h1 className="font-headline text-3xl font-bold">
              {book.title}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">by {book.author}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {book.moodTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6 space-y-2">
                <Button onClick={handleShowSummary} className="w-full" variant="outline">
                    <BrainCircuit className="mr-2 h-4 w-4" /> Quick Summary
                </Button>
                <Button asChild className="w-full">
                  <a href={book.affiliateLink} target="_blank" rel="noopener noreferrer">
                    Buy on Amazon <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:col-span-7">
           <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-3xl font-bold border-b pb-4">
              Reader View
            </h2>
            {isSpeaking ? (
                <Button onClick={handleStop} variant="destructive">
                    <Square className="mr-2 h-4 w-4" /> Stop
                </Button>
            ) : (
                <Button onClick={handleListen}>
                    <Play className="mr-2 h-4 w-4" /> Listen to Book
                </Button>
            )}
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none mt-6 space-y-4 text-foreground/90 font-serif leading-relaxed">
            {book.fullText.split('\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
