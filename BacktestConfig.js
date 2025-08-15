import React, { useState } from 'react';
import './BacktestConfig.css';

function BacktestConfig({ onStart }) {
  const [config, setConfig] = useState({
    symbol: 'BTC/USD',
    timeframe: '1h',
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    strategy: 'sma_crossover',
    params: {
      shortPeriod: 9,
      longPeriod: 21,
      riskPerTrade: 1,
      stopLoss: 2,
      takeProfit: 3
    }
  });

  const strategies = [
    { id: 'sma_crossover', name: 'SMA Crossover', description: 'Croisement de moyennes mobiles' },
    { id: 'rsi_divergence', name: 'RSI Divergence', description: 'Divergence du RSI' },
    { id: 'breakout', name: 'Breakout', description: 'Cassure de niveaux' },
    { id: 'macd', name: 'MACD', description: 'Convergence/Divergence des moyennes mobiles' }
  ];

  const handleParamChange = (param, value) => {
    setConfig(prev => ({
      ...prev,
      params: {
        ...prev.params,
        [param]: Number(value)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(config);
  };

  return (
    <div className="backtest-config">
      <form onSubmit={handleSubmit} className="config-form">
        <div className="form-section">
          <h3>Marché</h3>
          <div className="form-group">
            <label>Paire</label>
            <select
              value={config.symbol}
              onChange={(e) => setConfig(prev => ({ ...prev, symbol: e.target.value }))}
            >
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Timeframe</label>
            <select
              value={config.timeframe}
              onChange={(e) => setConfig(prev => ({ ...prev, timeframe: e.target.value }))}
            >
              <option value="5m">5 minutes</option>
              <option value="15m">15 minutes</option>
              <option value="1h">1 heure</option>
              <option value="4h">4 heures</option>
              <option value="1d">1 jour</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date début</label>
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Date fin</label>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Stratégie</h3>
          <div className="strategy-selector">
            {strategies.map(strategy => (
              <div
                key={strategy.id}
                className={`strategy-card ${config.strategy === strategy.id ? 'active' : ''}`}
                onClick={() => setConfig(prev => ({ ...prev, strategy: strategy.id }))}
              >
                <h4>{strategy.name}</h4>
                <p>{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Paramètres</h3>
          <div className="form-group">
            <label>Capital initial ($)</label>
            <input
              type="number"
              value={config.initialCapital}
              onChange={(e) => setConfig(prev => ({ ...prev, initialCapital: Number(e.target.value) }))}
              min="100"
              required
            />
          </div>

          <div className="params-grid">
            <div className="form-group">
              <label>SMA Court Terme</label>
              <input
                type="number"
                value={config.params.shortPeriod}
                onChange={(e) => handleParamChange('shortPeriod', e.target.value)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>SMA Long Terme</label>
              <input
                type="number"
                value={config.params.longPeriod}
                onChange={(e) => handleParamChange('longPeriod', e.target.value)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Risk par trade (%)</label>
              <input
                type="number"
                value={config.params.riskPerTrade}
                onChange={(e) => handleParamChange('riskPerTrade', e.target.value)}
                step="0.1"
                min="0.1"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Stop Loss (%)</label>
              <input
                type="number"
                value={config.params.stopLoss}
                onChange={(e) => handleParamChange('stopLoss', e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>
            <div className="form-group">
              <label>Take Profit (%)</label>
              <input
                type="number"
                value={config.params.takeProfit}
                onChange={(e) => handleParamChange('takeProfit', e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="start-btn">
          Lancer le Backtest
        </button>
      </form>
    </div>
  );
}

export default BacktestConfig; 