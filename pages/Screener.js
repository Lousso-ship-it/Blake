import React, { useState, useEffect } from 'react';
import ScreenerFilters from '../components/ScreenerFilters';
import ScreenerResults from '../components/ScreenerResults';
import './Screener.css';

function Screener() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [savedScreens, setSavedScreens] = useState([
    {
      id: '1',
      name: 'Crypto Momentum',
      description: 'Cryptos avec forte tendance haussière'
    },
    {
      id: '2',
      name: 'RSI Oversold',
      description: 'Actifs en survente (RSI < 30)'
    }
  ]);

  const handleApplyFilters = async (filters) => {
    setIsLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données de test
      setResults([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          icon: '/assets/crypto/btc.png',
          price: 43521.65,
          change24h: 2.45,
          volume: 28500000000,
          marketCap: 845000000000,
          priceHistory: [41000, 42100, 41800, 42500, 43100, 43500],
          indicators: {
            rsi: 58.5,
            macd: 1
          }
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          icon: '/assets/crypto/eth.png',
          price: 2285.30,
          change24h: -1.20,
          volume: 15200000000,
          marketCap: 275000000000,
          priceHistory: [2300, 2280, 2260, 2270, 2290, 2285],
          indicators: {
            rsi: 45.2,
            macd: -1
          }
        },
        // Plus d'actifs...
      ]);
    } catch (error) {
      console.error('Erreur lors du screening:', error);
      // Gérer l'erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screener">
      <div className="screener-header">
        <div className="header-content">
          <h1>Screener</h1>
          <p className="header-description">
            Trouvez les meilleures opportunités de trading
          </p>
        </div>

        <div className="saved-screens">
          <select className="screen-select">
            <option value="">Charger un screener sauvegardé</option>
            {savedScreens.map(screen => (
              <option key={screen.id} value={screen.id}>
                {screen.name} - {screen.description}
              </option>
            ))}
          </select>
          <button className="save-btn">
            <i className="fas fa-save"></i>
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="screener-content">
        <div className="filters-panel">
          <ScreenerFilters onApplyFilters={handleApplyFilters} />
        </div>

        {isLoading ? (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <h3>Recherche en cours...</h3>
              <p>Analyse des actifs selon vos critères</p>
            </div>
          </div>
        ) : results ? (
          <div className="results-panel">
            <ScreenerResults results={results} />
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h2>Configurez vos filtres</h2>
            <p>Utilisez les filtres à gauche pour commencer votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Screener; 