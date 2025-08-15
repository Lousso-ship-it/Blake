import React, { useState } from 'react';
import BacktestConfig from '../components/BacktestConfig';
import BacktestResults from '../components/BacktestResults';
import './Backtesting.css';

function Backtesting() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [savedTests, setSavedTests] = useState([
    {
      id: '1',
      name: 'SMA Crossover BTC/USD',
      date: '2024-01-30',
      profit: 15.2
    },
    {
      id: '2',
      name: 'RSI Strategy ETH/USD',
      date: '2024-01-29',
      profit: -5.8
    }
  ]);

  const handleStartBacktest = async (config) => {
    setIsRunning(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données de test
      setResults({
        netProfit: 15.2,
        profitAmount: 1520,
        winRate: 68,
        totalTrades: 45,
        maxDrawdown: -12.5,
        maxDrawdownDate: '2024-01-15',
        sharpeRatio: 1.8,
        profitFactor: 2.1,
        avgWinLossRatio: 1.5,
        avgTradeDuration: '4h 23min',
        recoveryFactor: 1.2,
        trades: [
          {
            date: '2024-01-31T10:00:00',
            type: 'LONG',
            entryPrice: 43000,
            exitPrice: 43500,
            pnlPercent: 1.16,
            pnlAmount: 116,
            equity: 10116
          },
          // Plus de trades...
        ],
        monthlyStats: [
          {
            month: 'Janvier 2024',
            trades: 45,
            pnl: 15.2
          },
          // Plus de stats mensuelles...
        ]
      });
    } catch (error) {
      console.error('Erreur lors du backtest:', error);
      // Gérer l'erreur
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="backtesting">
      <div className="backtesting-header">
        <div className="header-content">
          <h1>Backtesting</h1>
          <p className="header-description">
            Testez vos stratégies de trading sur des données historiques
          </p>
        </div>

        <div className="saved-tests">
          <select className="test-select">
            <option value="">Charger un backtest sauvegardé</option>
            {savedTests.map(test => (
              <option key={test.id} value={test.id}>
                {test.name} ({test.date}) - {test.profit > 0 ? '+' : ''}{test.profit}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="backtesting-content">
        <div className="config-section">
          <BacktestConfig onStart={handleStartBacktest} />
        </div>

        {isRunning && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="spinner"></div>
              <h3>Exécution du Backtest...</h3>
              <p>Analyse des données historiques en cours</p>
            </div>
          </div>
        )}

        {results && !isRunning && (
          <div className="results-section">
            <BacktestResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Backtesting; 