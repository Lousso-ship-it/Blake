import React, { useState, useEffect } from 'react';
import './WidgetSelector.css';

interface WidgetSelectorProps {
  onSelect: (widgetType: string, dataSource: string) => void;
  onClose: () => void;
}

interface WidgetTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export function WidgetSelector({ onSelect, onClose }: WidgetSelectorProps) {
  const [templates, setTemplates] = useState<WidgetTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WidgetTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState('');

  useEffect(() => {
    loadTemplates();
    loadDataSources();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await window.electron.invoke('get-widget-templates');
      setTemplates(data);
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  };

  const loadDataSources = async () => {
    try {
      const sources = await window.electron.invoke('get-data-sources');
      setDataSources(sources);
    } catch (error) {
      console.error('Erreur chargement sources:', error);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConfirm = () => {
    if (selectedTemplate && selectedDataSource) {
      onSelect(selectedTemplate.type, selectedDataSource);
      onClose();
    }
  };

  return (
    <div className="widget-selector-overlay">
      <div className="widget-selector-modal">
        <div className="modal-header">
          <h2>Ajouter un Widget</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un widget..."
            />
          </div>

          <div className="category-filters">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Tous
            </button>
            {['chart', 'table', 'metric', 'custom'].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div
              key={template.type}
              className={`template-card ${selectedTemplate?.type === template.type ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(template)}
            >
              <i className={`fas fa-${template.icon}`}></i>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="data-source-selector">
            <h3>Source de données</h3>
            <select
              value={selectedDataSource}
              onChange={(e) => setSelectedDataSource(e.target.value)}
            >
              <option value="">Sélectionnez une source</option>
              {dataSources.map(source => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Annuler</button>
          <button
            className="confirm-btn"
            disabled={!selectedTemplate || !selectedDataSource}
            onClick={handleConfirm}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
} 