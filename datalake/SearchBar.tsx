import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

interface SearchSuggestion {
  id: string;
  text: string;
  type: string;
  category: string;
}

interface SearchBarProps {
  onDataSelect: (data: any) => void;
}

export function SearchBar({ onDataSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    timeRange: 'all',
    dataTypes: [] as string[]
  });
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current && clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await window.electron.invoke('datalake-search', {
          query,
          filters
        });
        setSuggestions(result.suggestions);
      } catch (error) {
        console.error('Erreur recherche:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      searchTimeout.current && clearTimeout(searchTimeout.current);
    };
  }, [query, filters]);

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    try {
      const data = await window.electron.invoke('datalake-fetch-data', {
        id: suggestion.id,
        type: suggestion.category
      });
      onDataSelect(data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <i className="fas fa-search"></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des données..."
          className="search-input"
        />
        {loading && <div className="search-spinner"></div>}
      </div>

      <div className="search-filters">
        <select
          value={filters.timeRange}
          onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
        >
          <option value="all">Toute période</option>
          <option value="1d">Dernier jour</option>
          <option value="1w">Dernière semaine</option>
          <option value="1m">Dernier mois</option>
          <option value="1y">Dernière année</option>
        </select>

        <div className="category-filters">
          {['Markets', 'Economy', 'Companies', 'Crypto', 'Commodities'].map(category => (
            <button
              key={category}
              className={`category-btn ${filters.categories.includes(category.toLowerCase()) ? 'active' : ''}`}
              onClick={() => {
                setFilters(prev => ({
                  ...prev,
                  categories: prev.categories.includes(category.toLowerCase())
                    ? prev.categories.filter(c => c !== category.toLowerCase())
                    : [...prev.categories, category.toLowerCase()]
                }));
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <i className={`fas fa-${suggestion.type}`}></i>
              <span>{suggestion.text}</span>
              <span className="suggestion-category">{suggestion.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 