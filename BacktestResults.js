import React from 'react';
import { Line } from 'react-chartjs-2';
import './BacktestResults.css';

function BacktestResults({ results }) {
  const equityCurveData = {
    labels: results?.trades.map(trade => new Date(trade.date).toLocaleDateString()),
    datasets: [{
      label: 'Équité',
      data: results?.trades.map(trade => trade.equity),
      borderColor: '#26a69a',
      backgroundColor: 'rgba(38, 166, 154, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: '#2B2B43'
        },
        ticks: {
          color: '#a0a0a0'
        }
      },
      x: {
        grid: {
          color: '#2B2B43'
        },
        ticks: {
          color: '#a0a0a0',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="backtest-results">
      <div className="results-header">
        <h2>Résultats du Backtest</h2>
        <div className="header-actions">
          <button className="action-btn">
            <i className="fas fa-download"></i>
            Exporter
          </button>
          <button className="action-btn">
            <i className="fas fa-save"></i>
            Sauvegarder
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Profit Net</h4>
          <div className={`metric-value ${results.netProfit >= 0 ? 'positive' : 'negative'}`}>
            {results.netProfit.toFixed(2)}%
          </div>
          <div className="metric-subtitle">
            {results.profitAmount.toFixed(2)}$
          </div>
        </div>

        <div className="metric-card">
          <h4>Ratio Gain/Perte</h4>
          <div className="metric-value">
            {results.winRate.toFixed(1)}%
          </div>
          <div className="metric-subtitle">
            {results.totalTrades} trades
          </div>
        </div>

        <div className="metric-card">
          <h4>Drawdown Max</h4>
          <div className="metric-value negative">
            {results.maxDrawdown.toFixed(2)}%
          </div>
          <div className="metric-subtitle">
            {new Date(results.maxDrawdownDate).toLocaleDateString()}
          </div>
        </div>

        <div className="metric-card">
          <h4>Ratio Sharpe</h4>
          <div className={`metric-value ${results.sharpeRatio >= 1 ? 'positive' : 'neutral'}`}>
            {results.sharpeRatio.toFixed(2)}
          </div>
          <div className="metric-subtitle">
            Annualisé
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Courbe d'Équité</h3>
        <div className="chart-container">
          <Line data={equityCurveData} options={chartOptions} />
        </div>
      </div>

      <div className="trades-section">
        <h3>Historique des Trades</h3>
        <div className="trades-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Entrée</th>
                <th>Sortie</th>
                <th>P&L (%)</th>
                <th>P&L ($)</th>
              </tr>
            </thead>
            <tbody>
              {results.trades.map((trade, index) => (
                <tr key={index} className={trade.pnlPercent >= 0 ? 'positive' : 'negative'}>
                  <td>{new Date(trade.date).toLocaleString()}</td>
                  <td>{trade.type}</td>
                  <td>{trade.entryPrice.toFixed(2)}</td>
                  <td>{trade.exitPrice.toFixed(2)}</td>
                  <td>{trade.pnlPercent.toFixed(2)}%</td>
                  <td>{trade.pnlAmount.toFixed(2)}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Analyse Détaillée</h3>
        <div className="analysis-grid">
          <div className="analysis-card">
            <h4>Performance Mensuelle</h4>
            <table className="monthly-table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th>Trades</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {results.monthlyStats.map((month, index) => (
                  <tr key={index}>
                    <td>{month.month}</td>
                    <td>{month.trades}</td>
                    <td className={month.pnl >= 0 ? 'positive' : 'negative'}>
                      {month.pnl.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analysis-card">
            <h4>Statistiques Avancées</h4>
            <div className="stats-list">
              <div className="stat-item">
                <span>Profit Factor</span>
                <span>{results.profitFactor.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span>Avg Win/Loss Ratio</span>
                <span>{results.avgWinLossRatio.toFixed(2)}</span>
              </div>
              <div className="stat-item">
                <span>Avg Trade Duration</span>
                <span>{results.avgTradeDuration}</span>
              </div>
              <div className="stat-item">
                <span>Recovery Factor</span>
                <span>{results.recoveryFactor.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BacktestResults; 