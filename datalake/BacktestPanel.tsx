import React, { useState, useEffect } from 'react';
import { datalakeService } from '../../services/datalakeService';
import { TimeSeriesChart } from './TimeSeriesChart';
import './BacktestPanel.css';

interface BacktestPanelProps {
  data: any[];
  analysis: any;
}

interface BacktestConfig {
  initialCapital: number;
  positionSize: number;
  stopLoss: number;
  takeProfit: number;
  maxPositions: number;
}

export function BacktestPanel({ data, analysis }: BacktestPanelProps) {
  const [config, setConfig] = useState<BacktestConfig>({
    initialCapital: 100000,
    positionSize: 0.1,
    stopLoss: 0.02,
    takeProfit: 0.05,
    maxPositions: 1
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runBacktest = async () => {
    try {
      setLoading(true);
      const backtestResults = await datalakeService.runBacktest(data, analysis, config);
      setResults(backtestResults);
    } catch (error) {
      console.error('Erreur backtest:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backtest-panel">
      <div className="backtest-config">
        <h3>Configuration</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Capital Initial</label>
            <input
              type="number"
              value={config.initialCapital}
              onChange={e => setConfig({ ...config, initialCapital: Number(e.target.value) })}
            />
          </div>
          <div className="config-item">
            <label>Taille Position (%)</label>
            <input
              type="number"
              value={config.positionSize * 100}
              onChange={e => setConfig({ ...config, positionSize: Number(e.target.value) / 100 })}
              min="1"
              max="100"
            />
          </div>
          <div className="config-item">
            <label>Stop Loss (%)</label>
            <input
              type="number"
              value={config.stopLoss * 100}
              onChange={e => setConfig({ ...config, stopLoss: Number(e.target.value) / 100 })}
              min="0.1"
              max="100"
            />
          </div>
          <div className="config-item">
            <label>Take Profit (%)</label>
            <input
              type="number"
              value={config.takeProfit * 100}
              onChange={e => setConfig({ ...config, takeProfit: Number(e.target.value) / 100 })}
              min="0.1"
              max="100"
            />
          </div>
          <div className="config-item">
            <label>Positions Max</label>
            <input
              type="number"
              value={config.maxPositions}
              onChange={e => setConfig({ ...config, maxPositions: Number(e.target.value) })}
              min="1"
              max="10"
            />
          </div>
        </div>
        <button 
          className="run-backtest-btn"
          onClick={runBacktest}
          disabled={loading}
        >
          {loading ? 'Exécution...' : 'Lancer le Backtest'}
        </button>
      </div>

      {results && (
        <div className="backtest-results">
          <div className="results-header">
            <h3>Résultats</h3>
            <div className="metrics-summary">
              <div className="metric">
                <span className="label">Rendement Total</span>
                <span className={`value ${results.metrics.totalReturn >= 0 ? 'positive' : 'negative'}`}>
                  {results.metrics.totalReturn.toFixed(2)}%
                </span>
              </div>
              <div className="metric">
                <span className="label">Ratio de Sharpe</span>
                <span className="value">{results.metrics.sharpeRatio.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="label">Drawdown Max</span>
                <span className="value negative">-{results.metrics.maxDrawdown.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="equity-chart">
            <TimeSeriesChart
              data={results.equity}
              analysis={analysis}
              indicators={[]}
            />
          </div>

          <div className="detailed-metrics">
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Trades</h4>
                <div className="metric-row">
                  <span className="label">Total</span>
                  <span className="value">{results.metrics.totalTrades}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Gagnants</span>
                  <span className="value positive">{results.metrics.winningTrades}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Perdants</span>
                  <span className="value negative">{results.metrics.losingTrades}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Win Rate</span>
                  <span className="value">{(results.metrics.winRate * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="metric-card">
                <h4>Performance</h4>
                <div className="metric-row">
                  <span className="label">Gain Moyen</span>
                  <span className="value positive">{results.metrics.averageWin.toFixed(2)}%</span>
                </div>
                <div className="metric-row">
                  <span className="label">Perte Moyenne</span>
                  <span className="value negative">{results.metrics.averageLoss.toFixed(2)}%</span>
                </div>
                <div className="metric-row">
                  <span className="label">Plus Gros Gain</span>
                  <span className="value positive">{results.metrics.largestWin.toFixed(2)}%</span>
                </div>
                <div className="metric-row">
                  <span className="label">Plus Grosse Perte</span>
                  <span className="value negative">{results.metrics.largestLoss.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 