import React, { useState, useEffect } from 'react';
import './WidgetSettings.css';

interface WidgetSettingsProps {
  widget: WidgetConfig;
  onUpdate: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  onClose: () => void;
}

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  dataSource: string;
  settings: any;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export function WidgetSettings({ widget, onUpdate, onClose }: WidgetSettingsProps) {
  const [title, setTitle] = useState(widget.title);
  const [settings, setSettings] = useState(widget.settings);
  const [availableSettings, setAvailableSettings] = useState<any[]>([]);

  useEffect(() => {
    loadAvailableSettings();
  }, [widget.type]);

  const loadAvailableSettings = async () => {
    try {
      const data = await window.electron.invoke('get-widget-settings', {
        type: widget.type
      });
      setAvailableSettings(data);
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const handleSave = () => {
    onUpdate(widget.id, {
      title,
      settings
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="widget-settings-overlay">
      <div className="widget-settings-modal">
        <div className="modal-header">
          <h2>Paramètres du Widget</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="settings-content">
          <div className="setting-group">
            <label>Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du widget"
            />
          </div>

          {availableSettings.map(setting => (
            <div key={setting.key} className="setting-group">
              <label>{setting.label}</label>
              {renderSettingInput(setting, settings[setting.key], (value) => 
                handleSettingChange(setting.key, value)
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button className="save-btn" onClick={handleSave}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

function renderSettingInput(setting: any, value: any, onChange: (value: any) => void) {
  switch (setting.type) {
    case 'string':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={setting.placeholder}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          min={setting.min}
          max={setting.max}
          step={setting.step}
        />
      );
    case 'boolean':
      return (
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {setting.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    default:
      return null;
  }
} 