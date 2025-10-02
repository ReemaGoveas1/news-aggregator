import { Filters, UnifiedArticle } from '../types';

const GUARDIAN_API_KEY = "add_guardian_key_here";

export default async function fetchGuardianArticles(filters: Filters): Promise<UnifiedArticle[]> {
  let url = `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=trailText,thumbnail&page-size=20&order-by=newest`;

  if (filters.keyword) {
    url += `&q=${encodeURIComponent(filters.keyword)}`;
  }

  if (filters.category && filters.category !== 'all') {
    url += `&section=${encodeURIComponent(filters.category)}`; 
  }

  if (filters.startDate) {
    url += `&from-date=${encodeURIComponent(filters.startDate)}`;
  }

  if (filters.endDate) {
    url += `&to-date=${encodeURIComponent(filters.endDate)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch Guardian articles');
  }

  const data = await response.json();

  console.log("Guardian API response:", data);

  return data.response.results.map((article: any) => ({
    title: article.webTitle,
    description: article.fields?.trailText || '',
    url: article.webUrl,
    image: article.fields?.thumbnail || '',
    source: 'The Guardian',
    publishedAt: article.webPublicationDate,
    categories: article.sectionName ? [article.sectionName] : [],
  }));
}
