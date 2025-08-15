import React, { useState } from 'react';
import './AddWidget.css';

function AddWidget({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);
  const [widgetType, setWidgetType] = useState('');

  const widgetTemplates = [
    {
      type: 'price',
      title: 'Prix en temps réel',
      icon: 'chart-line',
      description: 'Suivez les prix des actifs en temps réel'
    },
    {
      type: 'volume',
      title: 'Volume de trading',
      icon: 'chart-bar',
      description: 'Analysez les volumes de trading'
    },
    {
      type: 'correlation',
      title: 'Corrélation',
      icon: 'project-diagram',
      description: 'Visualisez les corrélations entre actifs'
    },
    {
      type: 'heatmap',
      title: 'Heatmap',
      icon: 'th',
      description: 'Carte thermique des performances'
    }
  ];

  const handleTemplateSelect = (template) => {
    setWidgetType(template.type);
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour créer le widget
    setIsOpen(false);
  };

  return (
    <>
      <div className="widget-templates">
        {widgetTemplates.map(template => (
          <div
            key={template.type}
            className="template-card"
            onClick={() => handleTemplateSelect(template)}
          >
            <i className={`fas fa-${template.icon}`}></i>
            <h4>{template.title}</h4>
            <p>{template.description}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="widget-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configurer le widget</h3>
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="widget-form">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="Titre du widget"
                  required
                />
              </div>

              <div className="form-group">
                <label>Source de données</label>
                <select required>
                  <option value="">Sélectionner une source</option>
                  <option value="binance">Binance</option>
                  <option value="coinbase">Coinbase</option>
                  <option value="custom">API personnalisée</option>
                </select>
              </div>

              <div className="form-group">
                <label>Taille</label>
                <select required>
                  <option value="small">Petit</option>
                  <option value="medium">Moyen</option>
                  <option value="large">Grand</option>
                </select>
              </div>

              <div className="form-group">
                <label>Actualisation</label>
                <select required>
                  <option value="0">Manuel</option>
                  <option value="30">30 secondes</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                Ajouter le widget
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddWidget; 