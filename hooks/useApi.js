import { useState, useCallback } from 'react';
import api from '../services/api';

export function useApi(apiMethod) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiMethod.apply(api, params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiMethod]);

  return {
    data,
    error,
    loading,
    execute
  };
}

// Hooks spécifiques pour les opérations courantes
export function useLogin() {
  return useApi(api.login.bind(api));
}

export function useSignup() {
  return useApi(api.signup.bind(api));
}

export function useProfile() {
  return useApi(api.getUserProfile.bind(api));
}

export function useMarketData(symbol) {
  const { data, error, loading, execute } = useApi(api.getMarketPrices.bind(api));

  // Rafraîchissement automatique des données toutes les 5 secondes
  useEffect(() => {
    if (symbol) {
      const interval = setInterval(() => {
        execute(symbol);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [symbol, execute]);

  return { data, error, loading };
} 