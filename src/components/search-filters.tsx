'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Wand2, X } from 'lucide-react';
import { RecommendationsDialog } from './recommendations-dialog';

interface SearchFiltersProps {
  categories: string[];
  allMoodTags: string[];
}

export function SearchFilters({ categories, allMoodTags }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [categoryValue, setCategoryValue] = useState(searchParams.get('category') || '');
  const [moodValue, setMoodValue] = useState(searchParams.get('mood') || '');

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === '') {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        router.replace(`${pathname}?${createQueryString({ search: searchValue })}`);
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, pathname, router, createQueryString]);

  const handleCategoryChange = (value: string) => {
    const newValue = value === 'all' ? '' : value;
    setCategoryValue(newValue);
    startTransition(() => {
      router.replace(`${pathname}?${createQueryString({ category: newValue })}`);
    });
  };

  const handleMoodChange = (value: string) => {
    const newValue = value === moodValue ? '' : value;
    setMoodValue(newValue);
    startTransition(() => {
      router.replace(`${pathname}?${createQueryString({ mood: newValue })}`);
    });
  };

  const clearFilters = () => {
    setSearchValue('');
    setCategoryValue('');
    setMoodValue('');
    startTransition(() => {
      router.replace(pathname);
    });
  };

  const hasFilters = !!searchValue || !!categoryValue || !!moodValue;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <Select value={categoryValue} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <RecommendationsDialog onSelectMood={handleMoodChange} />
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-muted-foreground">Moods:</span>
        {allMoodTags.map(tag => (
          <Button
            key={tag}
            variant={moodValue === tag ? "default" : "outline"}
            size="sm"
            onClick={() => handleMoodChange(tag)}
            className="rounded-full"
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
