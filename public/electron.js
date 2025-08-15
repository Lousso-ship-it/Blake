const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { createClient } = require('@supabase/supabase-js');
const { WebSocket } = require('ws');
const ccxt = require('ccxt');

// Configuration Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Gestionnaire des connexions WebSocket
class WebSocketManager {
  constructor() {
    this.connections = new Map();
    this.subscriptions = new Map();
  }

  addConnection(exchange, symbol, type) {
    const key = `${exchange}-${symbol}-${type}`;
    if (this.connections.has(key)) return;

    const ws = this.createWebSocket(exchange, symbol, type);
    this.connections.set(key, ws);
  }

  removeConnection(exchange, symbol, type) {
    const key = `${exchange}-${symbol}-${type}`;
    if (!this.connections.has(key)) return;

    const ws = this.connections.get(key);
    ws.close();
    this.connections.delete(key);
  }

  createWebSocket(exchange, symbol, type) {
    // Configuration spécifique par exchange
    const wsUrls = {
      'binance': 'wss://stream.binance.com:9443/ws',
      'ftx': 'wss://ftx.com/ws/',
      'kraken': 'wss://ws.kraken.com'
    };

    const ws = new WebSocket(wsUrls[exchange]);

    ws.on('open', () => {
      console.log(`WebSocket connecté pour ${exchange} ${symbol} ${type}`);
      this.subscribe(ws, exchange, symbol, type);
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        mainWindow.webContents.send('market-data', {
          exchange,
          symbol,
          type,
          data: message
        });
      } catch (error) {
        console.error('Erreur parsing WebSocket message:', error);
      }
    });

    ws.on('error', (error) => {
      console.error(`WebSocket erreur pour ${exchange}:`, error);
    });

    ws.on('close', () => {
      console.log(`WebSocket fermé pour ${exchange} ${symbol} ${type}`);
      // Tentative de reconnexion après 5 secondes
      setTimeout(() => {
        this.addConnection(exchange, symbol, type);
      }, 5000);
    });

    return ws;
  }

  subscribe(ws, exchange, symbol, type) {
    const subscriptions = {
      'binance': {
        'ticker': {
          method: 'SUBSCRIBE',
          params: [`${symbol.toLowerCase()}@ticker`],
          id: Date.now()
        },
        'orderbook': {
          method: 'SUBSCRIBE',
          params: [`${symbol.toLowerCase()}@depth20@100ms`],
          id: Date.now()
        },
        'trades': {
          method: 'SUBSCRIBE',
          params: [`${symbol.toLowerCase()}@trade`],
          id: Date.now()
        }
      },
      // Ajouter d'autres exchanges ici
    };

    if (subscriptions[exchange] && subscriptions[exchange][type]) {
      ws.send(JSON.stringify(subscriptions[exchange][type]));
    }
  }
}

// Gestionnaire des exchanges CCXT
class ExchangeManager {
  constructor() {
    this.exchanges = new Map();
  }

  async initializeExchange(exchangeId, credentials) {
    try {
      const exchangeClass = ccxt[exchangeId];
      if (!exchangeClass) throw new Error(`Exchange ${exchangeId} non supporté`);

      const exchange = new exchangeClass({
        apiKey: credentials.apiKey,
        secret: credentials.secret,
        enableRateLimit: true,
        options: {
          defaultType: 'spot'
        }
      });

      await exchange.loadMarkets();
      this.exchanges.set(exchangeId, exchange);
      return true;
    } catch (error) {
      console.error(`Erreur initialisation ${exchangeId}:`, error);
      return false;
    }
  }

  getExchange(exchangeId) {
    return this.exchanges.get(exchangeId);
  }
}

let mainWindow;
const wsManager = new WebSocketManager();
const exchangeManager = new ExchangeManager();

// Handlers IPC pour les opérations de trading
ipcMain.handle('initialize-exchange', async (event, { exchangeId, credentials }) => {
  return await exchangeManager.initializeExchange(exchangeId, credentials);
});

ipcMain.handle('subscribe-market-data', (event, { exchange, symbol, type }) => {
  wsManager.addConnection(exchange, symbol, type);
  return true;
});

ipcMain.handle('unsubscribe-market-data', (event, { exchange, symbol, type }) => {
  wsManager.removeConnection(exchange, symbol, type);
  return true;
});

ipcMain.handle('place-order', async (event, { exchangeId, order }) => {
  try {
    const exchange = exchangeManager.getExchange(exchangeId);
    if (!exchange) throw new Error('Exchange non initialisé');

    const result = await exchange.createOrder(
      order.symbol,
      order.type,
      order.side,
      order.amount,
      order.price,
      order.params
    );

    return result;
  } catch (error) {
    console.error('Erreur placement ordre:', error);
    throw error;
  }
});

// Gestionnaires pour le Datalake
ipcMain.handle('datalake-search', async (event, { query, filters }) => {
  try {
    // Construire la requête en fonction des filtres
    const searchQuery = {
      text: query,
      categories: filters.categories,
      timeRange: filters.timeRange,
      dataTypes: filters.dataTypes
    };

    // Rechercher dans Supabase
    const { data, error } = await supabase
      .from('datalake_items')
      .select(`
        id,
        type,
        category,
        title,
        description,
        source,
        last_updated,
        metadata
      `)
      .textSearch('search_vector', query)
      .in('category', filters.categories.length ? filters.categories : ['markets', 'economy', 'companies', 'crypto', 'commodities', 'real-estate'])
      .order('last_updated', { ascending: false });

    if (error) throw error;

    // Formater les suggestions
    const suggestions = data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      type: getIconForCategory(item.category),
      category: item.category
    }));

    return {
      suggestions,
      results: data
    };
  } catch (error) {
    console.error('Erreur recherche datalake:', error);
    throw error;
  }
});

ipcMain.handle('datalake-fetch-data', async (event, { id, type }) => {
  try {
    // Récupérer les métadonnées de l'élément
    const { data: item, error: itemError } = await supabase
      .from('datalake_items')
      .select('*')
      .eq('id', id)
      .single();

    if (itemError) throw itemError;

    // Récupérer les données en fonction du type
    let timeseriesData;
    switch (type) {
      case 'market':
        timeseriesData = await fetchMarketData(item);
        break;
      case 'economic':
        timeseriesData = await fetchEconomicData(item);
        break;
      case 'fundamental':
        timeseriesData = await fetchFundamentalData(item);
        break;
      default:
        timeseriesData = await fetchGenericData(item);
    }

    return {
      metadata: item,
      data: timeseriesData
    };
  } catch (error) {
    console.error('Erreur récupération données:', error);
    throw error;
  }
});

// Fonctions utilitaires pour le Datalake
const getIconForCategory = (category) => {
  const icons = {
    markets: 'chart-line',
    economy: 'globe',
    companies: 'building',
    crypto: 'bitcoin',
    commodities: 'oil-can',
    'real-estate': 'home'
  };
  return icons[category] || 'database';
};

// Services de données
const fetchMarketData = async (item) => {
  // Exemple avec l'API Alpha Vantage
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const symbol = item.metadata.symbol;
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();
    return formatAlphaVantageData(data);
  } catch (error) {
    console.error('Erreur Alpha Vantage:', error);
    throw error;
  }
};

const fetchEconomicData = async (item) => {
  // Exemple avec l'API FRED
  const apiKey = process.env.FRED_API_KEY;
  const series = item.metadata.series_id;

  try {
    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${apiKey}&file_type=json`
    );
    const data = await response.json();
    return formatFREDData(data);
  } catch (error) {
    console.error('Erreur FRED:', error);
    throw error;
  }
};

const fetchFundamentalData = async (item) => {
  // Exemple avec Financial Modeling Prep
  const apiKey = process.env.FMP_API_KEY;
  const symbol = item.metadata.symbol;

  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?apikey=${apiKey}`
    );
    const data = await response.json();
    return formatFMPData(data);
  } catch (error) {
    console.error('Erreur FMP:', error);
    throw error;
  }
};

const fetchGenericData = async (item) => {
  // Récupérer les données depuis Supabase
  try {
    const { data, error } = await supabase
      .from('datalake_timeseries')
      .select('*')
      .eq('item_id', item.id)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur données génériques:', error);
    throw error;
  }
};

// Fonctions de formatage des données
const formatAlphaVantageData = (rawData) => {
  const timeSeries = rawData['Time Series (Daily)'];
  return Object.entries(timeSeries).map(([date, values]) => ({
    timestamp: date,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
    volume: parseFloat(values['5. volume'])
  }));
};

const formatFREDData = (rawData) => {
  return rawData.observations.map(obs => ({
    timestamp: obs.date,
    value: parseFloat(obs.value)
  }));
};

const formatFMPData = (rawData) => {
  return rawData.map(report => ({
    timestamp: report.date,
    revenue: report.revenue,
    grossProfit: report.grossProfit,
    netIncome: report.netIncome,
    eps: report.eps
  }));
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Gestion des IPC pour la communication avec le backend FastAPI
ipcMain.handle('api-request', async (event, { endpoint, method, data }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Ajouter le token d'authentification si nécessaire
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined
    });
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
});

// Gestionnaires IPC pour la Home
ipcMain.handle('fetch-economic-calendar', async (event, { startDate, endDate }) => {
  try {
    const API_KEY = process.env.FINANCIAL_CALENDAR_API_KEY;
    const response = await fetch(
      `https://api.marketaux.com/v1/calendar?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );
    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error('Erreur calendrier économique:', error);
    throw error;
  }
});

ipcMain.handle('fetch-news', async (event, { category, limit = 10 }) => {
  try {
    const API_KEY = process.env.NEWS_API_KEY;
    const response = await fetch(
      `https://api.marketaux.com/v1/news/all?api_key=${API_KEY}&categories=${category}&limit=${limit}`
    );
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Erreur actualités:', error);
    throw error;
  }
});

ipcMain.handle('fetch-market-opportunities', async (event) => {
  try {
    // Récupérer les données de marché depuis Supabase
    const { data: marketData, error } = await supabase
      .from('market_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Analyser les opportunités
    const opportunities = await analyzeMarketOpportunities(marketData);
    return opportunities;
  } catch (error) {
    console.error('Erreur opportunités:', error);
    throw error;
  }
});

ipcMain.handle('chat-gpt', async (event, { message, context }) => {
  try {
    const API_KEY = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant spécialisé en trading et analyse financière."
          },
          {
            role: "user",
            content: message,
            context: context
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur ChatGPT:', error);
    throw error;
  }
});

// Fonction utilitaire pour l'analyse des opportunités
async function analyzeMarketOpportunities(marketData) {
  const opportunities = [];
  
  // Analyser les tendances
  const trends = analyzeTrends(marketData);
  
  // Analyser les divergences
  const divergences = analyzeDivergences(marketData);
  
  // Analyser les patterns techniques
  const patterns = analyzePatterns(marketData);
  
  // Combiner et filtrer les résultats
  return [...trends, ...divergences, ...patterns]
    .filter(opp => opp.score > 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function analyzeTrends(data) {
  return data.map(asset => {
    const prices = asset.prices;
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const rsi = calculateRSI(prices, 14);
    
    let score = 0;
    let type = '';
    let reason = [];
    
    // Analyse de tendance haussière
    if (sma20 > sma50 && rsi < 70) {
      score += 0.3;
      type = 'bullish';
      reason.push('Croisement SMA20/SMA50 haussier');
    }
    
    // Analyse de tendance baissière
    if (sma20 < sma50 && rsi > 30) {
      score += 0.3;
      type = 'bearish';
      reason.push('Croisement SMA20/SMA50 baissier');
    }
    
    // Autres conditions...
    
    return {
      asset: asset.symbol,
      type,
      score,
      reason,
      timestamp: new Date().toISOString()
    };
  });
}

function analyzeDivergences(data) {
  // Implémentation de l'analyse des divergences
  return [];
}

function analyzePatterns(data) {
  // Implémentation de l'analyse des patterns
  return [];
}

function calculateSMA(prices, period) {
  // Implémentation du calcul de la moyenne mobile simple
  return 0; // Placeholder, actual implementation needed
}

function calculateRSI(prices, period) {
  // Implémentation du calcul de l'indicateur RSI
  return 0; // Placeholder, actual implementation needed
}

// Gestionnaires IPC pour le Datalake
ipcMain.handle('fetch-market-data', async (event, { symbol, timeframe, limit }) => {
  try {
    const { data, error } = await supabase
      .from('market_data')
      .select('*')
      .eq('symbol', symbol)
      .eq('timeframe', timeframe)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur fetch market data:', error);
    throw error;
  }
});

ipcMain.handle('analyze-data', async (event, { data, indicators }) => {
  try {
    const results = {};
    
    // Calcul des indicateurs techniques
    for (const indicator of indicators) {
      switch (indicator.type) {
        case 'RSI':
          results.rsi = calculateRSI(data, indicator.period);
          break;
        case 'MACD':
          results.macd = calculateMACD(data, indicator.fastPeriod, indicator.slowPeriod, indicator.signalPeriod);
          break;
        case 'BB':
          results.bb = calculateBollingerBands(data, indicator.period, indicator.stdDev);
          break;
        // Ajoutez d'autres indicateurs ici
      }
    }

    return results;
  } catch (error) {
    console.error('Erreur analyse data:', error);
    throw error;
  }
});

ipcMain.handle('save-analysis', async (event, { symbol, timeframe, analysis }) => {
  try {
    const { data, error } = await supabase
      .from('analysis')
      .insert({
        symbol,
        timeframe,
        analysis,
        created_at: new Date().toISOString(),
        user_id: supabase.auth.user()?.id
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur sauvegarde analyse:', error);
    throw error;
  }
});

// Fonctions utilitaires pour les calculs d'indicateurs
function calculateRSI(data, period) {
  const prices = data.map(d => d.close);
  let gains = 0;
  let losses = 0;

  // Calcul des gains et pertes moyens
  for (let i = 1; i < period + 1; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  // Calcul du RSI initial
  gains /= period;
  losses /= period;
  
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(data, fastPeriod, slowPeriod, signalPeriod) {
  const prices = data.map(d => d.close);
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i]);
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram = macdLine.map((macd, i) => macd - signalLine[i]);

  return {
    macdLine,
    signalLine,
    histogram
  };
}

function calculateBollingerBands(data, period, stdDev) {
  const prices = data.map(d => d.close);
  const sma = calculateSMA(prices, period);
  const bands = sma.map((middle, i) => {
    const slice = prices.slice(i - period + 1, i + 1);
    const std = calculateStandardDeviation(slice);
    return {
      upper: middle + (std * stdDev),
      middle,
      lower: middle - (std * stdDev)
    };
  });

  return bands;
}

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = [data[0]];

  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }

  return ema;
}

function calculateSMA(data, period) {
  let sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

function calculateStandardDeviation(data) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squareDiffs = data.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / data.length;
  return Math.sqrt(avgSquareDiff);
} 