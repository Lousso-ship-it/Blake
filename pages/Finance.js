import React, { useState } from 'react';
import FinanceTracker from '../components/FinanceTracker';
import './Finance.css';

function Finance() {
  const [activeTab, setActiveTab] = useState('tracker');

  const renderContent = () => {
    switch (activeTab) {
      case 'tracker':
        return <FinanceTracker />;
      case 'investments':
        return <div>Section Investissements en développement</div>;
      case 'analysis':
        return <div>Section Analyse en développement</div>;
      default:
        return <FinanceTracker />;
    }
  };

  return (
    <div className="finance">
      <header className="section-header">
        <h1>Finance</h1>
        <div className="finance-tabs">
          <button
            className={`tab ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            Suivi
          </button>
          <button
            className={`tab ${activeTab === 'investments' ? 'active' : ''}`}
            onClick={() => setActiveTab('investments')}
          >
            Investissements
          </button>
          <button
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            Analyse
          </button>
        </div>
      </header>

      <div className="finance-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default Finance; 