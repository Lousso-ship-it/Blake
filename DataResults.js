import React from 'react';
import './DataResults.css';

function DataResults({ results }) {
  // Exemple de résultats
  const mockResults = [
    {
      type: 'chart',
      title: 'Inflation USA vs EUR',
      category: 'economic',
      preview: 'chart-preview-1.png',
      lastUpdate: '2024-01-31'
    },
    {
      type: 'dataset',
      title: 'Données historiques BTC/USD',
      category: 'crypto',
      format: 'CSV',
      size: '2.3MB',
      lastUpdate: '2024-01-31'
    },
    {
      type: 'visualization',
      title: 'Carte des taux d\'intérêt mondiaux',
      category: 'economic',
      preview: 'map-preview-1.png',
      lastUpdate: '2024-01-30'
    }
  ];

  return (
    <div className="data-results">
      <div className="results-header">
        <div className="results-count">
          15 résultats trouvés
        </div>
        <div className="results-filters">
          <select className="filter-select">
            <option value="relevance">Pertinence</option>
            <option value="date">Date</option>
            <option value="popularity">Popularité</option>
          </select>
          <select className="filter-select">
            <option value="all">Tous les types</option>
            <option value="charts">Graphiques</option>
            <option value="datasets">Données</option>
            <option value="visualizations">Visualisations</option>
          </select>
        </div>
      </div>

      <div className="results-grid">
        {mockResults.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-preview">
              {result.type === 'dataset' ? (
                <div className="dataset-icon">
                  <i className="fas fa-table"></i>
                  <span className="format">{result.format}</span>
                </div>
              ) : (
                <img src={result.preview} alt={result.title} />
              )}
            </div>
            <div className="result-info">
              <div className="result-header">
                <h3>{result.title}</h3>
                <span className={`category-tag ${result.category}`}>
                  {result.category}
                </span>
              </div>
              <div className="result-meta">
                <span className="type">
                  <i className={`fas fa-${result.type === 'chart' ? 'chart-line' : 
                    result.type === 'dataset' ? 'table' : 'map'}`}></i>
                  {result.type}
                </span>
                {result.size && <span className="size">{result.size}</span>}
                <span className="update">
                  Mis à jour le {new Date(result.lastUpdate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataResults; 