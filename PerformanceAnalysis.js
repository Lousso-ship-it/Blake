import React from 'react';
import { Line } from 'react-chartjs-2';
import './PerformanceAnalysis.css';

function PerformanceAnalysis() {
  const performanceData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Performance (%)',
        data: [2.5, 5.8, 4.2, 8.5, 7.2, 10.5],
        borderColor: '#26a69a',
        backgroundColor: 'rgba(38, 166, 154, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
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
          color: '#a0a0a0'
        }
      }
    }
  };

  const stats = [
    { label: 'Rendement Total', value: '+10.5%', trend: 'positive' },
    { label: 'Trades Gagnants', value: '68%', trend: 'positive' },
    { label: 'Ratio Risque/Récompense', value: '2.1', trend: 'neutral' },
    { label: 'Drawdown Max', value: '-5.2%', trend: 'negative' }
  ];

  return (
    <div className="performance-analysis">
      <div className="performance-header">
        <h3>Analyse des Performances</h3>
        <select className="period-selector">
          <option value="1M">1 Mois</option>
          <option value="3M">3 Mois</option>
          <option value="6M" selected>6 Mois</option>
          <option value="1Y">1 An</option>
          <option value="ALL">Tout</option>
        </select>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-value ${stat.trend}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <Line data={performanceData} options={options} />
      </div>

      <div className="trade-history">
        <h4>Historique des Trades</h4>
        <table className="trade-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Paire</th>
              <th>Type</th>
              <th>P&L</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>31/01/24</td>
              <td>BTC/USD</td>
              <td>Long</td>
              <td className="positive">+2.3%</td>
            </tr>
            <tr>
              <td>30/01/24</td>
              <td>ETH/USD</td>
              <td>Short</td>
              <td className="negative">-1.2%</td>
            </tr>
            {/* Plus de trades... */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceAnalysis; 