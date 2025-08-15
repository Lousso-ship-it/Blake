import React from 'react';
import { EconomicCalendar } from './EconomicCalendar';
import { NewsPanel } from './NewsPanel';
import { MarketOpportunities } from './MarketOpportunities';
import { TradingAssistant } from './TradingAssistant';
import './Home.css';

export function Home() {
  return (
    <div className="home-container">
      <div className="home-grid">
        <div className="home-section calendar">
          <EconomicCalendar />
        </div>
        <div className="home-section news">
          <NewsPanel />
        </div>
        <div className="home-section opportunities">
          <MarketOpportunities />
        </div>
        <div className="home-section assistant">
          <TradingAssistant />
        </div>
      </div>
    </div>
  );
} 