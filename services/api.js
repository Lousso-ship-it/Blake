import { ipcRenderer } from 'electron';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, method = 'GET', data = null) {
    try {
      const response = await ipcRenderer.invoke('api-request', {
        endpoint,
        method,
        data,
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
      });

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentification
  async login(email, password) {
    const response = await this.request('/auth/login', 'POST', { email, password });
    if (response.data?.access_token) {
      this.setToken(response.data.access_token);
    }
    return response;
  }

  async signup(email, password) {
    return await this.request('/auth/signup', 'POST', { email, password });
  }

  async logout() {
    this.clearToken();
    return await this.request('/auth/logout', 'POST');
  }

  // Profil utilisateur
  async getUserProfile() {
    return await this.request('/user/profile');
  }

  async updateUserProfile(data) {
    return await this.request('/user/profile', 'PUT', data);
  }

  // Données de marché
  async getMarketPrices(symbol) {
    return await this.request(`/market/prices/${symbol}`);
  }

  async getOrderBook(symbol) {
    return await this.request(`/market/orderbook/${symbol}`);
  }

  // Trading
  async placeOrder(orderData) {
    return await this.request('/trading/order', 'POST', orderData);
  }

  async cancelOrder(orderId) {
    return await this.request(`/trading/order/${orderId}`, 'DELETE');
  }

  async getOpenOrders() {
    return await this.request('/trading/orders/open');
  }

  async getOrderHistory() {
    return await this.request('/trading/orders/history');
  }

  // Positions
  async getOpenPositions() {
    return await this.request('/trading/positions');
  }

  async closePosition(positionId) {
    return await this.request(`/trading/position/${positionId}/close`, 'POST');
  }

  // Analyse
  async getPerformanceMetrics() {
    return await this.request('/analysis/performance');
  }

  async getSentimentData(symbol) {
    return await this.request(`/analysis/sentiment/${symbol}`);
  }

  // Screener
  async runScreener(filters) {
    return await this.request('/screener/run', 'POST', filters);
  }

  async getSavedScreeners() {
    return await this.request('/screener/saved');
  }

  async saveScreener(screenerData) {
    return await this.request('/screener/save', 'POST', screenerData);
  }

  // Backtesting
  async runBacktest(config) {
    return await this.request('/backtest/run', 'POST', config);
  }

  async getBacktestHistory() {
    return await this.request('/backtest/history');
  }

  // Watchlist
  async getWatchlist() {
    return await this.request('/watchlist');
  }

  async addToWatchlist(symbol) {
    return await this.request('/watchlist/add', 'POST', { symbol });
  }

  async removeFromWatchlist(symbol) {
    return await this.request(`/watchlist/remove/${symbol}`, 'DELETE');
  }

  // Notifications
  async getNotifications() {
    return await this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return await this.request(`/notifications/${notificationId}/read`, 'POST');
  }
}

export const api = new ApiService();
export default api; 