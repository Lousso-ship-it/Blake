import React, { useState, useEffect } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import './MarketOpportunities.css';

function MarketOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Obtenir les données en temps réel pour chaque opportunité
  const btcData = useMarketData('binance', 'BTC/USD', 'ticker');
  const ethData = useMarketData('binance', 'ETH/USD', 'ticker');

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        // Simulation de données
        const mockOpportunities = [
          {
            id: 1,
            symbol: 'BTC/USD',
            type: 'technical',
            signal: 'buy',
            pattern: 'Golden Cross',
            confidence: 85,
            timeframe: '4h',
            description: 'Croisement des moyennes mobiles 50 et 200',
            indicators: {
              rsi: 42,
              macd: 'bullish',
              volume: '+25%'
            }
          },
          {
            id: 2,
            symbol: 'ETH/USD',
            type: 'breakout',
            signal: 'sell',
            pattern: 'Résistance majeure',
            confidence: 75,
            timeframe: '1h',
            description: 'Test de la résistance à 2300$',
            indicators: {
              rsi: 68,
              macd: 'bearish',
              volume: '+45%'
            }
          }
        ];

        setOpportunities(mockOpportunities);
      } catch (error) {
        console.error('Erreur lors du chargement des opportunités:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filterOpportunities = () => {
    if (selectedCategory === 'all') return opportunities;
    return opportunities.filter(opp => opp.type === selectedCategory);
  };

  return (
    <div className="market-opportunities">
      <div className="opportunities-header">
        <h3>Opportunités de Marché</h3>
        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tout
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'technical' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('technical')}
          >
            Technique
          </button>
          <button
            className={`filter-btn ${selectedCategory === 'breakout' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('breakout')}
          >
            Breakout
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <span>Analyse des marchés...</span>
        </div>
      ) : (
        <div className="opportunities-list">
          {filterOpportunities().map(opportunity => (
            <div key={opportunity.id} className="opportunity-card">
              <div className="opportunity-header">
                <div className="symbol-info">
                  <span className="symbol">{opportunity.symbol}</span>
                  <span className={`signal ${opportunity.signal}`}>
                    {opportunity.signal.toUpperCase()}
                  </span>
                </div>
                <div className="confidence">
                  <span className="label">Confiance</span>
                  <span className="value">{opportunity.confidence}%</span>
                </div>
              </div>

              <div className="pattern-info">
                <span className="pattern-name">{opportunity.pattern}</span>
                <span className="timeframe">{opportunity.timeframe}</span>
              </div>

              <p className="description">{opportunity.description}</p>

              <div className="indicators">
                <div className="indicator">
                  <span className="label">RSI</span>
                  <span className="value">{opportunity.indicators.rsi}</span>
                </div>
                <div className="indicator">
                  <span className="label">MACD</span>
                  <span className={`value ${opportunity.indicators.macd}`}>
                    {opportunity.indicators.macd}
                  </span>
                </div>
                <div className="indicator">
                  <span className="label">Volume</span>
                  <span className="value">{opportunity.indicators.volume}</span>
                </div>
              </div>

              <button className="view-details-btn">
                Voir les détails
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketOpportunities; 