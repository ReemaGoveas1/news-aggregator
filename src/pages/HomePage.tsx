import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import ArticleList from '../components/Article';
import { UnifiedArticle, Filters, UserPreferences } from '../types';
import fetchGuardianArticles from '../services/guardianApi';
import fetchNytArticles from '../services/nytApi';
import PreferenceForm from '../components/PreferenceForm';
import '../App.css';

export default function Home () {
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    category: 'all',
    source: 'all',
    startDate: '',
    endDate: '',
  });

  const [articles, setArticles] = useState<UnifiedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      const preferences: UserPreferences = user.preferences || {};

      setFilters((prev) => ({
        ...prev,
        source: preferences.sources?.[0] || 'all',
        category: preferences.categories?.[0] || 'all',
      }));
    }
  }, []);

  const onFilter = async () => {
    setLoading(true);
    setError(null);

    try {
      const [nytArticles, guardianArticles ] = await Promise.all([
        fetchNytArticles(filters),
        fetchGuardianArticles(filters),
      ]);

      const combined = [...nytArticles , ...guardianArticles];

      const filtered = combined.filter((article) => {
        const matchesKeyword =
          !filters.keyword ||
          article.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          article.description.toLowerCase().includes(filters.keyword.toLowerCase());

        const publishedDate = new Date(article.publishedAt);

        const afterStart = filters.startDate
          ? publishedDate >= new Date(filters.startDate)
          : true;

        const beforeEnd = filters.endDate
          ? publishedDate <= new Date(filters.endDate)
          : true;

        const matchesCategory =
          filters.category === 'all' || article.categories.includes(filters.category);

        const matchesSource =
          filters.source === 'all' ||
          article.source.toLowerCase().includes(filters.source.toLowerCase());

        return matchesKeyword && afterStart && beforeEnd && matchesCategory && matchesSource;
      });

      setArticles(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter();
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="container">
      <button
        onClick={() => setShowPreferences(!showPreferences)}
        style={{ marginBottom: '20px' }}
      >
        {showPreferences ? 'Hide Preferences' : 'Edit Preferences'}
      </button>

      {showPreferences && (
        <PreferenceForm
          onSave={(preferences) => {
            setFilters((prev) => ({
              ...prev,
              source: preferences.sources?.[0] || 'all',
              category: preferences.categories?.[0] || 'all',
            }));
          }}
        />
      )}

      <SearchBar filters={filters} setFilters={setFilters} onFilter={onFilter} />
      {loading && <p>Loading articles...</p>}
      {error && <p>{error}</p>}
      <ArticleList articles={articles} />
    </div>
  );
};
