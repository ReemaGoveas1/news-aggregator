
export interface UnifiedArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
  categories: string[];
}

export interface Filters {
  keyword: string;
  category: string;
  source: string;
  startDate: string;
  endDate: string;
}

export interface UserPreferences {
  sources?: string[];
  categories?: string[];
  authors?: string[];
}