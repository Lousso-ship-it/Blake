import React, { useState } from 'react';
import './DataSearch.css';

function DataSearch({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'market', label: 'Marchés' },
    { id: 'economic', label: 'Économie' },
    { id: 'company', label: 'Entreprises' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'commodity', label: 'Matières Premières' },
    { id: 'realestate', label: 'Immobilier' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query: searchQuery, category: selectedCategory });
  };

  return (
    <div className="data-search">
      <div className="search-categories">
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

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des données, statistiques, graphiques..."
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          Rechercher
        </button>
      </form>

      <div className="search-suggestions">
        <h4>Suggestions populaires</h4>
        <div className="suggestion-tags">
          <span className="tag">Inflation USA</span>
          <span className="tag">Bitcoin Dominance</span>
          <span className="tag">Taux Directeurs</span>
          <span className="tag">PIB Mondial</span>
          <span className="tag">Corrélation BTC/SP500</span>
        </div>
      </div>
    </div>
  );
}

export default DataSearch; 