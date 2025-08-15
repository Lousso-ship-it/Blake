import React, { useState } from 'react';
import SearchEngine from '../components/datalake/SearchEngine';
import DataVisualizer from '../components/datalake/DataVisualizer';
import DataFilters from '../components/datalake/DataFilters';
import './Datalake.css';

function Datalake() {
  const [searchResults, setSearchResults] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    timeRange: 'all',
    dataTypes: [],
    sources: []
  });
  const [visualizationType, setVisualizationType] = useState('auto');

  return (
    <div className="datalake">
      <div className="datalake-header">
        <h1>Datalake</h1>
        <p className="subtitle">Explorez les données financières et économiques mondiales</p>
      </div>

      <div className="datalake-content">
        <div className="search-section">
          <SearchEngine 
            onSearch={setSearchResults}
            activeFilters={activeFilters}
          />
          <DataFilters
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        </div>

        <div className="visualization-section">
          <DataVisualizer
            data={searchResults}
            type={visualizationType}
            onTypeChange={setVisualizationType}
          />
        </div>
      </div>
    </div>
  );
}

export default Datalake; 