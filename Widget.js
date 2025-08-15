import React, { useState } from 'react';
import './Widget.css';

function Widget({ title, children, onRemove, onResize, id }) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="widget">
      <div className="widget-header">
        <h3>{title}</h3>
        <div className="widget-controls">
          <button 
            className="widget-control-btn"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
          >
            <i className="fas fa-cog"></i>
          </button>
          <button 
            className="widget-control-btn"
            onClick={() => onRemove(id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      {isConfigOpen && (
        <div className="widget-config">
          <select onChange={(e) => onResize(id, e.target.value)}>
            <option value="1x1">Petit (1x1)</option>
            <option value="2x1">Moyen (2x1)</option>
            <option value="2x2">Grand (2x2)</option>
          </select>
        </div>
      )}
      <div className="widget-content">
        {children}
      </div>
    </div>
  );
}

export default Widget; 