import { Filters, UnifiedArticle } from '../types';

const NYTIMES_API_KEY = 'd4UA9YUuQ0j6naCjJZBdDDp2QLtjwa54';
const NYTIMES_API_URL = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${NYTIMES_API_KEY}`;

let cachedArticles: UnifiedArticle[] | null = null;

export default async function fetchNytArticles(filters: Filters): Promise<UnifiedArticle[]> {
  if (cachedArticles) return cachedArticles;

  const response = await fetch(NYTIMES_API_URL);
  if (!response.ok) throw new Error('Failed to fetch NYT articles');

  const data = await response.json();
  console.log("data.results", data.results)
  const articles = data.results.map((article: any) => ({
    title: article.title,
    description: article.abstract || '',
    url: article.url,
    image: article.multimedia?.[0]?.url || '',
    source: 'NYTimes',
    publishedAt: article.published_date,
    categories: [article.section || 'general'],
  }));

  cachedArticles = articles;
  return articles;
}
