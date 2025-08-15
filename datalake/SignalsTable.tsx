import React, { useState } from 'react';
import './SignalsTable.css';

interface Signal {
  timestamp: string;
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  indicators: Record<string, number>;
  metadata: {
    price: number;
    signals: Array<{ type: string; strength: number }>;
  };
}

interface SignalsTableProps {
  signals: Signal[];
}

export function SignalsTable({ signals }: SignalsTableProps) {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'strength'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredSignals = signals.filter(signal => 
    filter === 'all' || signal.signal === filter
  );

  const sortedSignals = [...filteredSignals].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return sortOrder === 'asc'
        ? a.strength - b.strength
        : b.strength - a.strength;
    }
  });

  return (
    <div className="signals-table">
      <div className="signals-header">
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`filter-btn ${filter === 'buy' ? 'active' : ''}`}
            onClick={() => setFilter('buy')}
          >
            Achats
          </button>
          <button
            className={`filter-btn ${filter === 'sell' ? 'active' : ''}`}
            onClick={() => setFilter('sell')}
          >
            Ventes
          </button>
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'strength')}
          >
            <option value="date">Date</option>
            <option value="strength">Force</option>
          </select>
          <button
            className="sort-order"
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
          >
            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      <div className="signals-content">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Signal</th>
              <th>Force</th>
              <th>Prix</th>
              <th>Indicateurs</th>
            </tr>
          </thead>
          <tbody>
            {sortedSignals.map((signal, index) => (
              <tr key={index} className={signal.signal}>
                <td>{new Date(signal.timestamp).toLocaleString()}</td>
                <td>
                  <span className={`signal-badge ${signal.signal}`}>
                    {signal.signal === 'buy' ? 'ACHAT' : 'VENTE'}
                  </span>
                </td>
                <td>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ width: `${signal.strength * 100}%` }}
                    ></div>
                    <span>{(signal.strength * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>{signal.metadata.price.toFixed(2)}</td>
                <td>
                  <div className="indicators-summary">
                    {signal.metadata.signals.map((s, i) => (
                      <span key={i} className="indicator-tag">
                        {s.type} ({(s.strength * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 