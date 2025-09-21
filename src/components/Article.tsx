import { UnifiedArticle } from '../types';

interface Props {
  articles: UnifiedArticle[];
}

export default function ArticleList ({ articles }: Props) {
  return (
    <div className="container">
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="article-grid">
          {articles.map((article, index) => (
            <div key={index} className="article-card">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  loading="lazy"
                />
              )}
              <div className="article-content">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-title"
                >
                  {article.title}
                </a>
                <p className="article-description">{article.description}</p>
                <p className="article-meta">
                  <strong>Source:</strong> {article.source} |{' '}
                  <strong>Published:</strong>{' '}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
