import React from 'react';
import './WidgetSelector.css';

function WidgetSelector({ onSelect, onClose }) {
  const widgets = [
    {
      id: 'market-overview',
      title: 'Aperçu du Marché',
      description: 'Vue d\'ensemble des principaux marchés',
      icon: '📈'
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Suivi de vos investissements',
      icon: '💼'
    },
    {
      id: 'watchlist',
      title: 'Liste de Surveillance',
      description: 'Suivez vos actifs favoris',
      icon: '👀'
    },
    {
      id: 'news',
      title: 'Actualités',
      description: 'Dernières actualités financières',
      icon: '📰'
    },
    {
      id: 'calendar',
      title: 'Calendrier Économique',
      description: 'Événements économiques à venir',
      icon: '📅'
    }
  ];

  return (
    <div className="widget-selector">
      <div className="widget-selector-header">
        <h2>Ajouter un Widget</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="widget-list">
        {widgets.map(widget => (
          <div 
            key={widget.id}
            className="widget-option"
            onClick={() => {
              onSelect(widget);
              onClose();
            }}
          >
            <div className="widget-option-icon">{widget.icon}</div>
            <div className="widget-option-info">
              <h3>{widget.title}</h3>
              <p>{widget.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WidgetSelector; 