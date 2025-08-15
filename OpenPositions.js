import React from 'react';
import { useMarketData } from '../hooks/useMarketData';
import exchangeService from '../services/exchangeService';
import './OpenPositions.css';

function OpenPositions({ exchange = 'binance' }) {
  const [positions, setPositions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Obtenir les prix en temps réel pour chaque position
  const symbolPrices = Object.fromEntries(
    positions.map(pos => [
      pos.symbol,
      useMarketData(exchange, pos.symbol, 'ticker')
    ])
  );

  React.useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true);
        const response = await exchangeService.getOpenPositions();
        setPositions(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 10000); // Rafraîchir toutes les 10 secondes

    return () => clearInterval(interval);
  }, [exchange]);

  const handleClosePosition = async (positionId) => {
    try {
      await exchangeService.closePosition(positionId);
      setPositions(positions.filter(pos => pos.id !== positionId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isLoading) {
    return <div className="loading">Chargement des positions...</div>;
  }

  return (
    <div className="open-positions">
      <h3>Positions Ouvertes</h3>
      {positions.length === 0 ? (
        <div className="no-positions">
          Aucune position ouverte
        </div>
      ) : (
        <div className="positions-list">
          {positions.map(position => {
            const currentPrice = symbolPrices[position.symbol]?.data?.close;
            const pnl = currentPrice 
              ? (currentPrice - position.entryPrice) * position.quantity * (position.side === 'long' ? 1 : -1)
              : 0;
            const pnlPercent = position.entryPrice
              ? (pnl / (position.entryPrice * position.quantity)) * 100
              : 0;

            return (
              <div key={position.id} className="position-card">
                <div className="position-header">
                  <div className="position-symbol">{position.symbol}</div>
                  <div className={`position-type ${position.side}`}>
                    {position.side.toUpperCase()}
                  </div>
                </div>

                <div className="position-details">
                  <div className="detail">
                    <span>Quantité</span>
                    <span>{position.quantity}</span>
                  </div>
                  <div className="detail">
                    <span>Prix d'entrée</span>
                    <span>${position.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="detail">
                    <span>Prix actuel</span>
                    <span>${currentPrice?.toFixed(2) || '---'}</span>
                  </div>
                  <div className="detail">
                    <span>P&L</span>
                    <span className={pnl >= 0 ? 'profit' : 'loss'}>
                      ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <button
                  className="close-position-btn"
                  onClick={() => handleClosePosition(position.id)}
                >
                  Fermer la position
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OpenPositions; 