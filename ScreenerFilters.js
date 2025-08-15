import React, { useState } from 'react';
import './ScreenerFilters.css';

function ScreenerFilters({ onApplyFilters }) {
  const [filters, setFilters] = useState({
    market: 'crypto',
    priceMin: '',
    priceMax: '',
    volumeMin: '',
    marketCapMin: '',
    performance: {
      '1h': '',
      '24h': '',
      '7d': ''
    },
    indicators: {
      rsi: {
        enabled: false,
        min: 30,
        max: 70
      },
      macd: {
        enabled: false,
        signal: 'crossover'
      },
      volatility: {
        enabled: false,
        min: '',
        max: ''
      }
    }
  });

  const handleIndicatorToggle = (indicator) => {
    setFilters(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        [indicator]: {
          ...prev.indicators[indicator],
          enabled: !prev.indicators[indicator].enabled
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <div className="screener-filters">
      <form onSubmit={handleSubmit}>
        <div className="filters-section">
          <h3>Marché</h3>
          <div className="market-selector">
            <button
              type="button"
              className={`market-btn ${filters.market === 'crypto' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, market: 'crypto' }))}
            >
              <i className="fab fa-bitcoin"></i>
              Crypto
            </button>
            <button
              type="button"
              className={`market-btn ${filters.market === 'stocks' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, market: 'stocks' }))}
            >
              <i className="fas fa-chart-line"></i>
              Actions
            </button>
            <button
              type="button"
              className={`market-btn ${filters.market === 'forex' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, market: 'forex' }))}
            >
              <i className="fas fa-dollar-sign"></i>
              Forex
            </button>
          </div>
        </div>

        <div className="filters-section">
          <h3>Prix & Volume</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label>Prix Min ($)</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Prix Max ($)</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                placeholder="999999"
              />
            </div>
            <div className="form-group">
              <label>Volume Min ($)</label>
              <input
                type="number"
                value={filters.volumeMin}
                onChange={(e) => setFilters(prev => ({ ...prev, volumeMin: e.target.value }))}
                placeholder="100000"
              />
            </div>
            <div className="form-group">
              <label>Market Cap Min ($)</label>
              <input
                type="number"
                value={filters.marketCapMin}
                onChange={(e) => setFilters(prev => ({ ...prev, marketCapMin: e.target.value }))}
                placeholder="1000000"
              />
            </div>
          </div>
        </div>

        <div className="filters-section">
          <h3>Performance</h3>
          <div className="filters-grid">
            <div className="form-group">
              <label>1h (%)</label>
              <input
                type="number"
                value={filters.performance['1h']}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  performance: { ...prev.performance, '1h': e.target.value }
                }))}
                placeholder="+/-"
              />
            </div>
            <div className="form-group">
              <label>24h (%)</label>
              <input
                type="number"
                value={filters.performance['24h']}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  performance: { ...prev.performance, '24h': e.target.value }
                }))}
                placeholder="+/-"
              />
            </div>
            <div className="form-group">
              <label>7d (%)</label>
              <input
                type="number"
                value={filters.performance['7d']}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  performance: { ...prev.performance, '7d': e.target.value }
                }))}
                placeholder="+/-"
              />
            </div>
          </div>
        </div>

        <div className="filters-section">
          <h3>Indicateurs Techniques</h3>
          <div className="indicators-list">
            <div className="indicator-item">
              <div className="indicator-header">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.indicators.rsi.enabled}
                    onChange={() => handleIndicatorToggle('rsi')}
                  />
                  <span>RSI</span>
                </label>
              </div>
              {filters.indicators.rsi.enabled && (
                <div className="indicator-params">
                  <input
                    type="number"
                    value={filters.indicators.rsi.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        rsi: { ...prev.indicators.rsi, min: e.target.value }
                      }
                    }))}
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.indicators.rsi.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        rsi: { ...prev.indicators.rsi, max: e.target.value }
                      }
                    }))}
                    placeholder="Max"
                  />
                </div>
              )}
            </div>

            <div className="indicator-item">
              <div className="indicator-header">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.indicators.macd.enabled}
                    onChange={() => handleIndicatorToggle('macd')}
                  />
                  <span>MACD</span>
                </label>
              </div>
              {filters.indicators.macd.enabled && (
                <div className="indicator-params">
                  <select
                    value={filters.indicators.macd.signal}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      indicators: {
                        ...prev.indicators,
                        macd: { ...prev.indicators.macd, signal: e.target.value }
                      }
                    }))}
                  >
                    <option value="crossover">Croisement</option>
                    <option value="bullish">Bullish</option>
                    <option value="bearish">Bearish</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="apply-filters-btn">
          Appliquer les filtres
        </button>
      </form>
    </div>
  );
}

export default ScreenerFilters; 