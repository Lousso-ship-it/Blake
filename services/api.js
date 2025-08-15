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
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      });

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication
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

  // User profile
  async getUserProfile() {
    return await this.request('/user/profile');
  }

  // Market data
  async getMarketPrices(symbol) {
    return await this.request(`/market/prices/${symbol}`);
  }

  async getOrderBook(symbol) {
    return await this.request(`/market/orderbook/${symbol}`);
  }
}

export const api = new ApiService();
export default api;
