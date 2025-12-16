export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  imageHint: string;
  description: string;
  category: 'Business' | 'Fiction' | 'Self-Help';
  moodTags: string[];
  affiliateLink: string;
  fullText: string;
};
