import React, { useState, useEffect } from 'react';
import './NewsFeeds.css';

function NewsFeeds() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Simuler un appel API
    setTimeout(() => {
      setNews([
        {
          id: 1,
          title: "La FED maintient ses taux directeurs",
          source: "Bloomberg",
          category: "macro",
          timestamp: "2024-01-31T14:30:00",
          importance: "high"
        },
        {
          id: 2,
          title: "Apple dépasse les attentes au Q4",
          source: "Reuters",
          category: "stocks",
          timestamp: "2024-01-31T13:15:00",
          importance: "medium"
        },
        // Plus d'actualités...
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'macro', label: 'Macro' },
    { id: 'stocks', label: 'Actions' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' }
  ];

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <div className="news-feeds">
      <div className="news-categories">
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

      {loading ? (
        <div className="loading">Chargement des actualités...</div>
      ) : (
        <div className="news-list">
          {filteredNews.map(item => (
            <div key={item.id} className={`news-item ${item.importance}`}>
              <div className="news-header">
                <span className="news-source">{item.source}</span>
                <span className="news-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="news-title">{item.title}</h4>
              <div className="news-footer">
                <span className={`news-category ${item.category}`}>
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NewsFeeds; 