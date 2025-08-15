import React, { useState, useEffect } from 'react';
import { ChartWidget } from './widgets/ChartWidget';
import { TableWidget } from './widgets/TableWidget';
import { MetricWidget } from './widgets/MetricWidget';
import './Widget.css';

interface WidgetProps {
  config: WidgetConfig;
  onUpdate: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  onSelect: () => void;
  onDelete: () => void;
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

export function Widget({ config, onUpdate, onSelect, onDelete }: WidgetProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [config.dataSource]);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await window.electron.invoke('get-widget-data', {
        source: config.dataSource,
        settings: config.settings
      });
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement données widget:', err);
      setError('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const renderWidgetContent = () => {
    if (loading) {
      return (
        <div className="widget-loading">
          <div className="spinner"></div>
          <span>Chargement...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="widget-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      );
    }

    switch (config.type) {
      case 'chart':
        return <ChartWidget data={data} settings={config.settings} />;
      case 'table':
        return <TableWidget data={data} settings={config.settings} />;
      case 'metric':
        return <MetricWidget data={data} settings={config.settings} />;
      default:
        return <div>Type de widget non supporté</div>;
    }
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3>{config.title}</h3>
        <div className="widget-controls">
          <button onClick={loadData} title="Rafraîchir">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button onClick={onSelect} title="Paramètres">
            <i className="fas fa-cog"></i>
          </button>
          <button onClick={onDelete} title="Supprimer">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="widget-content">
        {renderWidgetContent()}
      </div>
    </div>
  );
} 