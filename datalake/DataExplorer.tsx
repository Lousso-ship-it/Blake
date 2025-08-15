import React, { useState } from 'react';
import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import './DataExplorer.css';

interface DataExplorerProps {
  selectedData: any;
  onAnalysisChange: (analysis: any) => void;
}

export function DataExplorer({ selectedData, onAnalysisChange }: DataExplorerProps) {
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [timeframe, setTimeframe] = useState('1d');
  const [indicators, setIndicators] = useState<string[]>([]);

  const handleAddIndicator = async (indicator: string) => {
    if (indicators.includes(indicator)) return;
    
    setIndicators([...indicators, indicator]);
    
    if (selectedData) {
      try {
        const analysis = await window.electron.invoke('analyze-data', {
          data: selectedData.data,
          indicators: [{
            type: indicator,
            period: 14, // Période par défaut
            // Autres paramètres spécifiques à l'indicateur
          }]
        });
        onAnalysisChange(analysis);
      } catch (error) {
        console.error('Erreur analyse:', error);
      }
    }
  };

  if (!selectedData) {
    return (
      <div className="data-explorer empty">
        <i className="fas fa-database"></i>
        <p>Sélectionnez des données à explorer</p>
      </div>
    );
  }

  return (
    <div className="data-explorer">
      <div className="explorer-header">
        <div className="data-info">
          <h2>{selectedData.metadata.title}</h2>
          <span className="data-source">{selectedData.metadata.source}</span>
        </div>

        <div className="explorer-controls">
          <div className="timeframe-selector">
            {['1h', '4h', '1d', '1w', '1m'].map(tf => (
              <button
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${activeTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              <i className="fas fa-chart-line"></i>
            </button>
            <button
              className={`toggle-btn ${activeTab === 'table' ? 'active' : ''}`}
              onClick={() => setActiveTab('table')}
            >
              <i className="fas fa-table"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="explorer-content">
        <div className="indicators-toolbar">
          <button
            className={`indicator-btn ${indicators.includes('RSI') ? 'active' : ''}`}
            onClick={() => handleAddIndicator('RSI')}
          >
            RSI
          </button>
          <button
            className={`indicator-btn ${indicators.includes('MACD') ? 'active' : ''}`}
            onClick={() => handleAddIndicator('MACD')}
          >
            MACD
          </button>
          <button
            className={`indicator-btn ${indicators.includes('BB') ? 'active' : ''}`}
            onClick={() => handleAddIndicator('BB')}
          >
            Bollinger
          </button>
        </div>

        {activeTab === 'chart' ? (
          <div className="chart-container">
            <TimeSeriesChart
              data={selectedData.data}
              indicators={indicators}
              timeframe={timeframe}
            />
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Ouverture</th>
                  <th>Haut</th>
                  <th>Bas</th>
                  <th>Fermeture</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {selectedData.data.map((row: any) => (
                  <tr key={row.timestamp}>
                    <td>{new Date(row.timestamp).toLocaleString()}</td>
                    <td>{row.open}</td>
                    <td>{row.high}</td>
                    <td>{row.low}</td>
                    <td>{row.close}</td>
                    <td>{row.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 