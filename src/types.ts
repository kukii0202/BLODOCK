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
  provider?: 'Unsplash' | 'Pexels' | 'Pixabay' | 'QuickChart';
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

