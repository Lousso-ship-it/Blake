import React, { useMemo } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import './OrderBook.css';

function OrderBook({ symbol, exchange = 'binance' }) {
  const { data, error, isLoading } = useMarketData(exchange, symbol, 'orderbook');

  const { bids, asks } = useMemo(() => {
    if (!data) return { bids: [], asks: [] };

    // Format spécifique à Binance
    const processedBids = data.bids.map(([price, quantity]) => ({
      price: parseFloat(price),
      quantity: parseFloat(quantity)
    }));

    const processedAsks = data.asks.map(([price, quantity]) => ({
      price: parseFloat(price),
      quantity: parseFloat(quantity)
    }));

    return {
      bids: processedBids.slice(0, 10),
      asks: processedAsks.slice(0, 10).reverse()
    };
  }, [data]);

  if (error) {
    return (
      <div className="order-book error">
        <p>Erreur de chargement du carnet d'ordres</p>
      </div>
    );
  }

  return (
    <div className="order-book">
      <div className="order-book-header">
        <h3>Carnet d'ordres</h3>
        <span className="symbol">{symbol}</span>
      </div>

      <div className="order-book-content">
        <div className="order-book-headers">
          <span>Prix</span>
          <span>Quantité</span>
          <span>Total</span>
        </div>

        <div className="asks">
          {asks.map((ask, index) => (
            <div key={`ask-${index}`} className="order-row ask">
              <span className="price">{ask.price.toFixed(2)}</span>
              <span className="quantity">{ask.quantity.toFixed(6)}</span>
              <span className="total">{(ask.price * ask.quantity).toFixed(2)}</span>
              <div 
                className="depth-visualization"
                style={{
                  width: `${(ask.quantity / Math.max(...asks.map(a => a.quantity))) * 100}%`
                }}
              />
            </div>
          ))}
        </div>

        <div className="spread">
          <span>
            Spread: {asks[asks.length - 1] && bids[0] 
              ? ((asks[asks.length - 1].price - bids[0].price) / bids[0].price * 100).toFixed(3)
              : '---'
            }%
          </span>
        </div>

        <div className="bids">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="order-row bid">
              <span className="price">{bid.price.toFixed(2)}</span>
              <span className="quantity">{bid.quantity.toFixed(6)}</span>
              <span className="total">{(bid.price * bid.quantity).toFixed(2)}</span>
              <div 
                className="depth-visualization"
                style={{
                  width: `${(bid.quantity / Math.max(...bids.map(b => b.quantity))) * 100}%`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default OrderBook; 