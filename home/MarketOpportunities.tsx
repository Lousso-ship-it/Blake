import React, { useState, useEffect } from 'react';
import './MarketOpportunities.css';

interface Opportunity {
  id: string;
  asset: string;
  type: 'bullish' | 'bearish';
  score: number;
  reason: string[];
  timestamp: string;
}

export function MarketOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish'>('all');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const data = await window.electron.invoke('fetch-market-opportunities');
        setOpportunities(data);
      } catch (err) {
        setError('Erreur lors du chargement des opportunités');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
    const interval = setInterval(fetchOpportunities, 300000); // Rafraîchir toutes les 5 minutes

    return () => clearInterval(interval);
  }, []);

  const filteredOpportunities = opportunities.filter(opp => 
    filter === 'all' || opp.type === filter
  );

  if (loading) {
    return (
      <div className="opportunities-container loading">
        <div className="spinner"></div>
        <p>Analyse des marchés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-container error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="opportunities-container">
      <div className="opportunities-header">
        <h2>Opportunités de Marché</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`filter-btn ${filter === 'bullish' ? 'active' : ''}`}
            onClick={() => setFilter('bullish')}
          >
            Haussier
          </button>
          <button
            className={`filter-btn ${filter === 'bearish' ? 'active' : ''}`}
            onClick={() => setFilter('bearish')}
          >
            Baissier
          </button>
        </div>
      </div>

      <div className="opportunities-content">
        {filteredOpportunities.map(opportunity => (
          <div 
            key={opportunity.id} 
            className={`opportunity-card ${opportunity.type}`}
          >
            <div className="opportunity-header">
              <h3>{opportunity.asset}</h3>
              <div className="score-badge">
                <i className={`fas fa-${opportunity.type === 'bullish' ? 'arrow-up' : 'arrow-down'}`}></i>
                {(opportunity.score * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="reasons-list">
              {opportunity.reason.map((reason, index) => (
                <div key={index} className="reason-item">
                  <i className="fas fa-check"></i>
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="opportunity-footer">
              <span className="timestamp">
                {new Date(opportunity.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <button className="details-btn">
                Voir les détails
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 