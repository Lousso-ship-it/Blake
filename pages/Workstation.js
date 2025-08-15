import React, { useState } from 'react';
import TradingViewChart from '../components/TradingViewChart';
import OrderBook from '../components/OrderBook';
import OrderForm from '../components/OrderForm';
import PerformanceAnalysis from '../components/PerformanceAnalysis';
import SentimentAnalysis from '../components/SentimentAnalysis';
import GlobalNews from '../components/GlobalNews';
import './Workstation.css';

function Workstation() {
  const [currentSymbol, setCurrentSymbol] = useState('BTC/USD');
  const [selectedTab, setSelectedTab] = useState('trade');

  const renderContent = () => {
    switch (selectedTab) {
      case 'trade':
        return (
          <div className="workstation-content trading">
            <div className="main-chart">
              <TradingViewChart symbol={currentSymbol} />
            </div>
            
            <div className="side-panel">
              <div className="order-section">
                <div className="order-book-section">
                  <OrderBook symbol={currentSymbol} />
                </div>
                <div className="order-form-section">
                  <OrderForm symbol={currentSymbol} />
                </div>
              </div>
              <div className="news-section">
                <GlobalNews />
              </div>
            </div>
          </div>
        );
      
      case 'insights':
        return (
          <div className="workstation-content insights">
            <PerformanceAnalysis />
          </div>
        );
      
      case 'sentiment':
        return (
          <div className="workstation-content sentiment">
            <SentimentAnalysis />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="workstation">
      <div className="workstation-header">
        <div className="header-left">
          <div className="symbol-selector">
            <select 
              value={currentSymbol}
              onChange={(e) => setCurrentSymbol(e.target.value)}
            >
              <option value="BTC/USD">BTC/USD</option>
              <option value="ETH/USD">ETH/USD</option>
              <option value="SOL/USD">SOL/USD</option>
            </select>
          </div>

          {selectedTab === 'trade' && (
            <div className="market-info">
              <span className="current-price">$43,521.65</span>
              <span className="price-change positive">+2.45%</span>
              <span className="volume">Vol: 2.1B</span>
            </div>
          )}
        </div>

        <div className="tab-selector">
          <button
            className={`tab-btn ${selectedTab === 'trade' ? 'active' : ''}`}
            onClick={() => setSelectedTab('trade')}
          >
            <i className="fas fa-chart-line"></i>
            Trading
          </button>
          <button
            className={`tab-btn ${selectedTab === 'insights' ? 'active' : ''}`}
            onClick={() => setSelectedTab('insights')}
          >
            <i className="fas fa-chart-bar"></i>
            Insights
          </button>
          <button
            className={`tab-btn ${selectedTab === 'sentiment' ? 'active' : ''}`}
            onClick={() => setSelectedTab('sentiment')}
          >
            <i className="fas fa-brain"></i>
            Sentiment
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default Workstation; 