import React from 'react';
import './IndicatorsPanel.css';

interface IndicatorsPanelProps {
  analysis: {
    indicators: {
      rsi: number;
      macd: number;
      macdSignal: number;
      macdHist: number;
      bollingerUpper: number;
      bollingerMiddle: number;
      bollingerLower: number;
      momentum: number;
    };
  };
}

export function IndicatorsPanel({ analysis }: IndicatorsPanelProps) {
  const { indicators } = analysis;

  return (
    <div className="indicators-panel">
      <h3>Indicateurs Techniques</h3>
      
      <div className="indicator-group">
        <h4>RSI</h4>
        <div className="indicator-value">
          <span className={`value ${indicators.rsi > 70 ? 'overbought' : indicators.rsi < 30 ? 'oversold' : ''}`}>
            {indicators.rsi.toFixed(2)}
          </span>
          <div className="indicator-gauge">
            <div className="gauge-bar" style={{ width: `${indicators.rsi}%` }}></div>
          </div>
        </div>
      </div>

      <div className="indicator-group">
        <h4>MACD</h4>
        <div className="indicator-values">
          <div className="value-row">
            <span className="label">MACD</span>
            <span className={`value ${indicators.macd > 0 ? 'positive' : 'negative'}`}>
              {indicators.macd.toFixed(4)}
            </span>
          </div>
          <div className="value-row">
            <span className="label">Signal</span>
            <span className="value">{indicators.macdSignal.toFixed(4)}</span>
          </div>
          <div className="value-row">
            <span className="label">Histogramme</span>
            <span className={`value ${indicators.macdHist > 0 ? 'positive' : 'negative'}`}>
              {indicators.macdHist.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      <div className="indicator-group">
        <h4>Bandes de Bollinger</h4>
        <div className="indicator-values">
          <div className="value-row">
            <span className="label">Supérieure</span>
            <span className="value">{indicators.bollingerUpper.toFixed(2)}</span>
          </div>
          <div className="value-row">
            <span className="label">Moyenne</span>
            <span className="value">{indicators.bollingerMiddle.toFixed(2)}</span>
          </div>
          <div className="value-row">
            <span className="label">Inférieure</span>
            <span className="value">{indicators.bollingerLower.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="indicator-group">
        <h4>Momentum</h4>
        <div className="indicator-value">
          <span className={`value ${indicators.momentum > 0 ? 'positive' : 'negative'}`}>
            {indicators.momentum.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
} 