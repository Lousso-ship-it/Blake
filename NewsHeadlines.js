import React, { useState, useEffect } from 'react';
import './NewsHeadlines.css';

function NewsHeadlines() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Simulation de données
        const mockNews = [
          {
            id: 1,
            title: "La Fed maintient ses taux directeurs",
            source: "Bloomberg",
            category: "macro",
            time: "Il y a 2 heures",
            impact: "high",
            summary: "La Réserve fédérale maintient ses taux d'intérêt...",
            url: "#",
            sentiment: "neutral"
          },
          {
            id: 2,
            title: "Bitcoin dépasse les 45 000$",
            source: "CoinDesk",
            category: "crypto",
            time: "Il y a 30 minutes",
            impact: "medium",
            summary: "Le Bitcoin poursuit sa hausse après...",
            url: "#",
            sentiment: "positive"
          }
        ];

        setNews(mockNews);
      } catch (error) {
        console.error('Erreur lors du chargement des news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Rafraîchir toutes les 5 minutes

    return () => clearInterval(interval);
  }, []);

  const filterNews = () => {
    if (selectedSource === 'all') return news;
    return news.filter(item => item.category === selectedSource);
  };

  return (
    <div className="news-headlines">
      <div className="news-header">
        <h3>Actualités Financières</h3>
        <div className="source-filter">
          <button
            className={`source-btn ${selectedSource === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedSource('all')}
          >
            Tout
          </button>
          <button
            className={`source-btn ${selectedSource === 'macro' ? 'active' : ''}`}
            onClick={() => setSelectedSource('macro')}
          >
            Macro
          </button>
          <button
            className={`source-btn ${selectedSource === 'crypto' ? 'active' : ''}`}
            onClick={() => setSelectedSource('crypto')}
          >
            Crypto
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Chargement des actualités...</span>
        </div>
      ) : (
        <div className="news-list">
          {filterNews().map(item => (
            <a key={item.id} href={item.url} className="news-item" target="_blank" rel="noopener noreferrer">
              <div className="news-content">
                <div className="news-meta">
                  <span className="source">{item.source}</span>
                  <span className="time">{item.time}</span>
                </div>
                <h4 className="news-title">{item.title}</h4>
                <p className="news-summary">{item.summary}</p>
                <div className="news-footer">
                  <span className={`impact ${item.impact}`}>
                    Impact {item.impact.toUpperCase()}
                  </span>
                  <span className={`sentiment ${item.sentiment}`}>
                    {item.sentiment.toUpperCase()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsHeadlines; 