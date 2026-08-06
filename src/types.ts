export interface BlogImage {
  id: string;
  url: string;
  type: 'photo' | 'chart';
  alt: string;
  caption: string;
  source: string;
  sourceUrl?: string;
  insertedParagraphIndex: number;
  englishKeyword?: string;
<<<<<<< HEAD
  provider?: 'Pollinations' | 'Unsplash' | 'Pexels' | 'Pixabay' | 'QuickChart';
  fallbackUrl?: string;
  fallbackProvider?: 'Pollinations' | 'Unsplash' | 'Pexels' | 'Pixabay' | 'QuickChart';
=======
  provider?: 'Unsplash' | 'Pexels' | 'Pixabay' | 'QuickChart';
>>>>>>> 1e1c487de519d7936327d2b58b80e154d45956e0
}

export interface VerificationReport {
  score: number;
  hasMarkdownAlert: boolean;
  markdownFeedback: string;
  readabilityFeedback: string;
  seoFeedback: string;
  wonyoungCheerMessage: string;
}

export interface GeneratedPost {
  id: string;
  topic: string;
  category: string;
  platform?: string;
  tone?: string;
  title: string;
  content: string;
  wonyoungTip: string;
  metaDescription: string;
  keywordsUsed: string[];
  imageSearchKeywordsEn?: string[];
  timestamp: string;
  score?: number;
  verificationReport?: VerificationReport;
  images?: BlogImage[];
}

