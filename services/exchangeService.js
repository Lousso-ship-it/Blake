import { ipcRenderer } from 'electron';

class ExchangeService {
  constructor() {
    this.marketDataCallbacks = new Map();
    this.setupMarketDataListener();
  }

  setupMarketDataListener() {
    ipcRenderer.on('market-data', (event, data) => {
      const key = `${data.exchange}-${data.symbol}-${data.type}`;
      const callbacks = this.marketDataCallbacks.get(key) || [];
      callbacks.forEach(callback => callback(data.data));
    });
  }

  async initializeExchange(exchangeId, credentials) {
    return await ipcRenderer.invoke('initialize-exchange', {
      exchangeId,
      credentials
    });
  }

  subscribeToMarketData(exchange, symbol, type, callback) {
    const key = `${exchange}-${symbol}-${type}`;
    const callbacks = this.marketDataCallbacks.get(key) || [];
    this.marketDataCallbacks.set(key, [...callbacks, callback]);

    return ipcRenderer.invoke('subscribe-market-data', {
      exchange,
      symbol,
      type
    });
  }

  unsubscribeFromMarketData(exchange, symbol, type, callback) {
    const key = `${exchange}-${symbol}-${type}`;
    const callbacks = this.marketDataCallbacks.get(key) || [];
    this.marketDataCallbacks.set(
      key,
      callbacks.filter(cb => cb !== callback)
    );

    if (this.marketDataCallbacks.get(key).length === 0) {
      return ipcRenderer.invoke('unsubscribe-market-data', {
        exchange,
        symbol,
        type
      });
    }
  }

  async placeOrder(exchangeId, order) {
    return await ipcRenderer.invoke('place-order', {
      exchangeId,
      order
    });
  }
}

export const exchangeService = new ExchangeService();
export default exchangeService; 