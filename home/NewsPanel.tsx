import React, { useState, useEffect } from 'react';
import './NewsPanel.css';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export function NewsPanel() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'markets', label: 'Marchés' },
    { id: 'economy', label: 'Économie' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'commodities', label: 'Matières Premières' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await window.electron.invoke('fetch-news', {
          category: activeCategory === 'all' ? undefined : activeCategory,
          limit: 20
        });
        setNews(data);
      } catch (err) {
        setError('Erreur lors du chargement des actualités');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="news-container loading">
        <div className="spinner"></div>
        <p>Chargement des actualités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="news-container">
      <div className="news-header">
        <h2>Actualités Financières</h2>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="news-content">
        {news.map(article => (
          <div key={article.id} className="news-card">
            <div className="news-meta">
              <span className="news-source">{article.source}</span>
              <span className="news-time">
                {new Date(article.publishedAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <h3 className="news-title">{article.title}</h3>
            <p className="news-summary">{article.summary}</p>
            <div className="news-footer">
              <span className={`news-sentiment ${article.sentiment}`}>
                {article.sentiment && (
                  <i className={`fas fa-${
                    article.sentiment === 'positive' ? 'arrow-up' :
                    article.sentiment === 'negative' ? 'arrow-down' : 'minus'
                  }`}></i>
                )}
              </span>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                Lire plus <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 