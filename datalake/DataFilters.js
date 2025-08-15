import React from 'react';
import './DataFilters.css';

function DataFilters({ activeFilters, onFilterChange }) {
  const categories = [
    { id: 'markets', label: 'Marchés', icon: 'chart-line' },
    { id: 'economy', label: 'Économie', icon: 'globe' },
    { id: 'companies', label: 'Entreprises', icon: 'building' },
    { id: 'crypto', label: 'Crypto', icon: 'bitcoin' },
    { id: 'commodities', label: 'Matières Premières', icon: 'oil-can' },
    { id: 'real-estate', label: 'Immobilier', icon: 'home' }
  ];

  const timeRanges = [
    { id: 'all', label: 'Tout' },
    { id: '1y', label: '1 An' },
    { id: '5y', label: '5 Ans' },
    { id: '10y', label: '10 Ans' }
  ];

  const dataTypes = [
    { id: 'price', label: 'Prix' },
    { id: 'volume', label: 'Volume' },
    { id: 'fundamental', label: 'Fondamental' },
    { id: 'technical', label: 'Technique' },
    { id: 'sentiment', label: 'Sentiment' }
  ];

  const handleCategoryToggle = (categoryId) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(id => id !== categoryId)
      : [...activeFilters.categories, categoryId];
    
    onFilterChange({
      ...activeFilters,
      categories: newCategories
    });
  };

  const handleTimeRangeChange = (range) => {
    onFilterChange({
      ...activeFilters,
      timeRange: range
    });
  };

  const handleDataTypeToggle = (typeId) => {
    const newTypes = activeFilters.dataTypes.includes(typeId)
      ? activeFilters.dataTypes.filter(id => id !== typeId)
      : [...activeFilters.dataTypes, typeId];
    
    onFilterChange({
      ...activeFilters,
      dataTypes: newTypes
    });
  };

  return (
    <div className="data-filters">
      <div className="filter-section">
        <h3>Catégories</h3>
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeFilters.categories.includes(category.id) ? 'active' : ''}`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <i className={`fas fa-${category.icon}`}></i>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Période</h3>
        <div className="time-range-buttons">
          {timeRanges.map(range => (
            <button
              key={range.id}
              className={`time-btn ${activeFilters.timeRange === range.id ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange(range.id)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Types de Données</h3>
        <div className="data-types-list">
          {dataTypes.map(type => (
            <label key={type.id} className="data-type-checkbox">
              <input
                type="checkbox"
                checked={activeFilters.dataTypes.includes(type.id)}
                onChange={() => handleDataTypeToggle(type.id)}
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataFilters; 