import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './DashboardWidget.css';

function DashboardWidget({ widget, onEdit, onDelete }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const renderChart = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: widget.type !== 'line',
          position: 'bottom',
          labels: {
            color: '#a0a0a0',
            font: {
              size: 11
            }
          }
        }
      },
      scales: widget.type !== 'pie' ? {
        y: {
          grid: {
            color: '#2B2B43'
          },
          ticks: {
            color: '#a0a0a0'
          }
        },
        x: {
          grid: {
            color: '#2B2B43'
          },
          ticks: {
            color: '#a0a0a0'
          }
        }
      } : undefined
    };

    switch (widget.type) {
      case 'line':
        return <Line data={widget.data} options={chartOptions} />;
      case 'bar':
        return <Bar data={widget.data} options={chartOptions} />;
      case 'pie':
        return <Pie data={widget.data} options={chartOptions} />;
      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <div className={`dashboard-widget ${widget.size}`}>
      <div className="widget-header">
        <h3>{widget.title}</h3>
        <div className="widget-controls">
          <button 
            className="widget-btn"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            title="Configurer"
          >
            <i className="fas fa-cog"></i>
          </button>
          <button 
            className="widget-btn"
            onClick={() => onDelete(widget.id)}
            title="Supprimer"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {isConfigOpen && (
        <div className="widget-config">
          <div className="config-group">
            <label>Taille</label>
            <select 
              value={widget.size}
              onChange={(e) => onEdit(widget.id, { size: e.target.value })}
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>
          </div>
          <div className="config-group">
            <label>Actualisation</label>
            <select 
              value={widget.refreshInterval}
              onChange={(e) => onEdit(widget.id, { refreshInterval: e.target.value })}
            >
              <option value="0">Manuel</option>
              <option value="30">30 secondes</option>
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
        </div>
      )}

      <div className="widget-content">
        {renderChart()}
      </div>

      <div className="widget-footer">
        <span className="widget-source">{widget.source}</span>
        <span className="widget-update">
          Mis à jour: {new Date(widget.lastUpdate).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

export default DashboardWidget; 