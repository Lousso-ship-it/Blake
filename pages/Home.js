import React from 'react';
import EconomicCalendar from '../components/EconomicCalendar';
import MarketOpportunities from '../components/MarketOpportunities';
import NewsHeadlines from '../components/NewsHeadlines';
import TradingChatbot from '../components/TradingChatbot';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Dashboard</h1>
        <div className="market-status">
          <div className="market-time">
            <i className="fas fa-clock"></i>
            {new Date().toLocaleTimeString()}
          </div>
          <div className="market-indicators">
            <span className="market-open">Marchés Ouverts</span>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <div className="grid-item calendar-section">
          <EconomicCalendar />
        </div>

        <div className="grid-item opportunities-section">
          <MarketOpportunities />
        </div>

        <div className="grid-item news-section">
          <NewsHeadlines />
        </div>

        <div className="grid-item chatbot-section">
          <TradingChatbot />
        </div>
      </div>
    </div>
  );
}

export default Home; 