import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import './SearchEngine.css';

function SearchEngine({ onSearch, activeFilters }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // TODO: Implémenter l'API de recherche
        const response = await fetch(`/api/datalake/search?q=${searchQuery}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ filters: activeFilters })
        });

        const data = await response.json();
        setSuggestions(data.suggestions);
        onSearch(data.results);
      } catch (error) {
        console.error('Erreur de recherche:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [activeFilters]
  );

  const handleQueryChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  return (
    <div className="search-engine">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Rechercher des données (ex: 'PIB France', 'AAPL revenus', 'BTC volatilité'...)"
          className="search-input"
        />
        {isLoading && <div className="search-spinner" />}
      </div>

      {suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="suggestion-item"
              onClick={() => {
                setQuery(suggestion.text);
                onSearch(suggestion.results);
                setSuggestions([]);
              }}
            >
              <div className="suggestion-icon">
                <i className={`fas fa-${suggestion.type}`}></i>
              </div>
              <div className="suggestion-content">
                <span className="suggestion-text">{suggestion.text}</span>
                <span className="suggestion-category">{suggestion.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchEngine; 