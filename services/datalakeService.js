import { ipcRenderer } from 'electron';

class DatalakeService {
  async search(query, filters) {
    try {
      return await ipcRenderer.invoke('datalake-search', { query, filters });
    } catch (error) {
      console.error('Erreur recherche:', error);
      throw error;
    }
  }

  async fetchData(id, type) {
    try {
      return await ipcRenderer.invoke('datalake-fetch-data', { id, type });
    } catch (error) {
      console.error('Erreur récupération données:', error);
      throw error;
    }
  }

  async getCategories() {
    return [
      { id: 'markets', label: 'Marchés', icon: 'chart-line' },
      { id: 'economy', label: 'Économie', icon: 'globe' },
      { id: 'companies', label: 'Entreprises', icon: 'building' },
      { id: 'crypto', label: 'Crypto', icon: 'bitcoin' },
      { id: 'commodities', label: 'Matières Premières', icon: 'oil-can' },
      { id: 'real-estate', label: 'Immobilier', icon: 'home' }
    ];
  }

  async getDataTypes() {
    return [
      { id: 'price', label: 'Prix' },
      { id: 'volume', label: 'Volume' },
      { id: 'fundamental', label: 'Fondamental' },
      { id: 'technical', label: 'Technique' },
      { id: 'sentiment', label: 'Sentiment' }
    ];
  }
}

export const datalakeService = new DatalakeService();
export default datalakeService; 