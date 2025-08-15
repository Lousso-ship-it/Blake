import React, { useState } from 'react';
import './DataFilters.css';

function DataFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    assetType: 'all',
    region: 'all',
    dataType: 'all',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="data-filters">
      <div className="filter-group">
        <label>Période</label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        >
          <option value="all">Toutes les périodes</option>
          <option value="1d">Dernier jour</option>
          <option value="1w">Dernière semaine</option>
          <option value="1m">Dernier mois</option>
          <option value="1y">Dernière année</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Type d'actif</label>
        <select
          value={filters.assetType}
          onChange={(e) => handleFilterChange('assetType', e.target.value)}
        >
          <option value="all">Tous les actifs</option>
          <option value="stocks">Actions</option>
          <option value="crypto">Crypto-monnaies</option>
          <option value="forex">Forex</option>
          <option value="commodities">Matières premières</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Région</label>
        <select
          value={filters.region}
          onChange={(e) => handleFilterChange('region', e.target.value)}
        >
          <option value="all">Toutes les régions</option>
          <option value="na">Amérique du Nord</option>
          <option value="eu">Europe</option>
          <option value="asia">Asie</option>
          <option value="other">Autres</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Type de données</label>
        <select
          value={filters.dataType}
          onChange={(e) => handleFilterChange('dataType', e.target.value)}
        >
          <option value="all">Toutes les données</option>
          <option value="price">Prix</option>
          <option value="fundamental">Fondamentales</option>
          <option value="technical">Techniques</option>
          <option value="economic">Économiques</option>
        </select>
      </div>
    </div>
  );
}

export default DataFilters; 