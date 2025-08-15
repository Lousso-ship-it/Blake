import { useState, useEffect, useCallback } from 'react';
import exchangeService from '../services/exchangeService';

export function useMarketData(exchange, symbol, type) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleMarketData = useCallback((marketData) => {
    setData(marketData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      exchangeService.subscribeToMarketData(exchange, symbol, type, handleMarketData);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }

    return () => {
      exchangeService.unsubscribeFromMarketData(exchange, symbol, type, handleMarketData);
    };
  }, [exchange, symbol, type, handleMarketData]);

  return { data, error, isLoading };
} 