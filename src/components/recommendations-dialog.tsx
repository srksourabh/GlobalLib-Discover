'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { recommendBooks } from '@/ai/flows/ai-powered-book-recommendations';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface RecommendationsDialogProps {
  onSelectMood: (mood: string) => void;
}

export function RecommendationsDialog({ onSelectMood }: RecommendationsDialogProps) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!preferences.trim()) {
      toast({
        title: 'Preferences needed',
        description: 'Please tell us what you like to read.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setRecommendedTags([]);
    try {
      const result = await recommendBooks({ readingHistory: preferences });
      if (result.recommendedMoodTags && result.recommendedMoodTags.length > 0) {
        setRecommendedTags(result.recommendedMoodTags);
      } else {
        toast({
          title: 'No tags found',
          description: "We couldn't find any matching mood tags. Try describing your preferences differently.",
        });
      }
    } catch (error) {
      console.error('AI recommendation failed:', error);
      toast({
        title: 'An error occurred',
        description:
          'Failed to get recommendations. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    onSelectMood(tag);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          Get AI Recommendations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Book Recommendations</DialogTitle>
          <DialogDescription>
            Describe your reading habits, favorite genres, or books you've
            enjoyed, and our AI will suggest moods you might like.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="preferences"
            placeholder="e.g., I love fantasy novels with strong world-building and a bit of romance. I recently enjoyed 'The Name of the Wind' and 'Mistborn'."
            className="col-span-3"
            rows={5}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
          />
        </div>
        {loading && (
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {recommendedTags.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Recommended Moods:</h4>
            <div className="flex flex-wrap gap-2">
                {recommendedTags.map(tag => (
                    <button key={tag} onClick={() => handleSelectTag(tag)}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                            {tag}
                        </Badge>
                    </button>
                ))}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleGetRecommendations} disabled={loading}>
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
