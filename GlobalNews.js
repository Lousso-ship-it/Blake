import React, { useState, useEffect } from 'react';
import './GlobalNews.css';

function GlobalNews() {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'market', label: 'Marchés' },
    { id: 'economic', label: 'Économie' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' }
  ];

  // Simulation de données
  useEffect(() => {
    // En production, ceci serait un appel API
    setNewsData([
      {
        id: 1,
        category: 'market',
        title: 'La Fed maintient ses taux directeurs',
        source: 'Bloomberg',
        time: '2 min ago',
        impact: 'high',
        url: '#'
      },
      {
        id: 2,
        category: 'crypto',
        title: 'Bitcoin dépasse les 45 000$',
        source: 'CoinDesk',
        time: '15 min ago',
        impact: 'medium',
        url: '#'
      }
    ]);

    setEvents([
      {
        id: 1,
        title: 'PIB US Q4 2023',
        date: '2024-01-31T13:30:00Z',
        category: 'economic',
        impact: 'high',
        forecast: '2.1%',
        previous: '1.9%'
      },
      {
        id: 2,
        title: 'BCE - Taux Directeur',
        date: '2024-02-01T12:45:00Z',
        category: 'market',
        impact: 'high',
        forecast: '4.50%',
        previous: '4.50%'
      }
    ]);
  }, []);

  const getTimeUntil = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    const diff = eventDate - now;

    if (diff < 0) return 'Terminé';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}j`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const filteredNews = newsData.filter(news => 
    selectedCategory === 'all' || news.category === selectedCategory
  );

  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  return (
    <div className="global-news">
      <div className="news-header">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <i className="fas fa-newspaper"></i>
            Actualités
          </button>
          <button
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i>
            Événements
          </button>
        </div>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'news' ? (
        <div className="news-list">
          {filteredNews.map(news => (
            <a key={news.id} href={news.url} className="news-item" target="_blank" rel="noopener noreferrer">
              <div className="news-content">
                <div className="news-title">{news.title}</div>
                <div className="news-meta">
                  <span className="source">{news.source}</span>
                  <span className="time">{news.time}</span>
                </div>
              </div>
              <div className={`impact-indicator ${news.impact}`}></div>
            </a>
          ))}
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-time">
                <div className="countdown">{getTimeUntil(event.date)}</div>
                <div className="time">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="event-content">
                <div className="event-title">{event.title}</div>
                <div className="event-forecast">
                  <span className="label">Prév:</span>
                  <span className="value">{event.forecast}</span>
                  <span className="label">Préc:</span>
                  <span className="value">{event.previous}</span>
                </div>
              </div>
              <div className={`impact-indicator ${event.impact}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GlobalNews; 