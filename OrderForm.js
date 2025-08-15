import React, { useState } from 'react';
import exchangeService from '../services/exchangeService';
import { useMarketData } from '../hooks/useMarketData';
import './OrderForm.css';

function OrderForm({ symbol, exchange = 'binance' }) {
  const [orderType, setOrderType] = useState('limit');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data: tickerData } = useMarketData(exchange, symbol, 'ticker');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const order = {
        symbol,
        type: orderType,
        side,
        amount: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(price) : undefined
      };

      await exchangeService.placeOrder(exchange, order);
      
      // Réinitialiser le formulaire
      setQuantity('');
      setPrice('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form">
      <div className="order-form-header">
        <h3>Nouvel Ordre</h3>
        <div className="current-price">
          {tickerData ? (
            <>
              <span className="label">Prix actuel:</span>
              <span className="value">
                ${parseFloat(tickerData.price).toFixed(2)}
              </span>
            </>
          ) : '---'}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="order-type-selector">
          <button
            type="button"
            className={`type-btn ${side === 'buy' ? 'active buy' : ''}`}
            onClick={() => setSide('buy')}
          >
            Acheter
          </button>
          <button
            type="button"
            className={`type-btn ${side === 'sell' ? 'active sell' : ''}`}
            onClick={() => setSide('sell')}
          >
            Vendre
          </button>
        </div>

        <div className="order-options">
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option value="limit">Limit</option>
            <option value="market">Market</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantité</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            step="0.0001"
            min="0"
            required
          />
        </div>

        {orderType === 'limit' && (
          <div className="form-group">
            <label>Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className={`submit-btn ${side}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner small"></div>
          ) : (
            `${side === 'buy' ? 'Acheter' : 'Vendre'} ${symbol}`
          )}
        </button>
      </form>
    </div>
  );
}

export default OrderForm; 