import React, { useState } from 'react';
import DashboardWidget from '../components/DashboardWidget';
import AddWidget from '../components/AddWidget';
import './Dashboard.css';

function Dashboard() {
  const [widgets, setWidgets] = useState([
    {
      id: '1',
      type: 'line',
      title: 'BTC/USD Prix',
      size: 'medium',
      source: 'Binance',
      refreshInterval: '30',
      lastUpdate: new Date(),
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Prix BTC/USD',
          data: [42000, 44500, 43200, 48000, 45500, 47000],
          borderColor: '#26a69a',
          tension: 0.4
        }]
      }
    },
    // Plus de widgets...
  ]);

  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const handleAddWidget = (widget) => {
    setWidgets(prev => [...prev, { ...widget, id: Date.now().toString() }]);
    setIsAddingWidget(false);
  };

  const handleEditWidget = (id, updates) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    ));
  };

  const handleDeleteWidget = (id) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p className="header-description">
            Personnalisez votre tableau de bord avec des widgets
          </p>
        </div>
        <button 
          className="add-widget-btn"
          onClick={() => setIsAddingWidget(true)}
        >
          <i className="fas fa-plus"></i>
          Ajouter un widget
        </button>
      </div>

      {isAddingWidget && (
        <div className="add-widget-section">
          <AddWidget onAdd={handleAddWidget} />
        </div>
      )}

      <div className="widgets-grid">
        {widgets.map(widget => (
          <DashboardWidget
            key={widget.id}
            widget={widget}
            onEdit={handleEditWidget}
            onDelete={handleDeleteWidget}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 