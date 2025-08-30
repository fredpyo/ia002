require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Mock/utility
const nowIso = () => new Date().toISOString();

// External API helpers
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || '';
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';

async function fetchAlphaVantageGlobalQuote(symbol) {
  if (!ALPHA_VANTAGE_API_KEY) {
    return null;
  }
  const url = new URL('https://www.alphavantage.co/query');
  url.searchParams.set('function', 'GLOBAL_QUOTE');
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', ALPHA_VANTAGE_API_KEY);
  const res = await fetch(url.href);
  if (!res.ok) throw new Error(`AlphaVantage ${symbol} HTTP ${res.status}`);
  const json = await res.json();
  const q = json['Global Quote'];
  if (!q) return null;
  const price = parseFloat(q['05. price']);
  const changePctStr = (q['10. change percent'] || '0%').replace('%', '');
  const changePct = parseFloat(changePctStr);
  return { price, changePct };
}

async function fetchCoinGeckoSimplePrice(ids) {
  const url = new URL('https://api.coingecko.com/api/v3/simple/price');
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('vs_currencies', 'usd');
  url.searchParams.set('include_24hr_change', 'true');
  const headers = COINGECKO_API_KEY ? { 'x-cg-demo-api-key': COINGECKO_API_KEY } : {};
  const res = await fetch(url.href, { headers });
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const json = await res.json();
  return json; // { id: { usd: number, usd_24h_change: number } }
}

// GET /inflation
app.get('/inflation', (_req, res) => {
  res.json({
    month: '2025-08',
    monthlyInflationPct: 6.2,
    annualInflationPct: 278.5,
    updatedAt: nowIso(),
  });
});

// GET /exchange-rate (mock)
app.get('/exchange-rate', (_req, res) => {
  res.json({
    official: { buy: 850.0, sell: 870.0 },
    parallel: { buy: 1350.0, sell: 1400.0 },
    updatedAt: nowIso(),
  });
});

// GET /assets (real APIs when available)
app.get('/assets', async (_req, res) => {
  // Target watchlist: AAPL, SPY, BTC, ETH, GLD (GLD as proxy for gold)
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'SPY', name: 'S&P 500 ETF (SPY)' },
    { symbol: 'GLD', name: 'SPDR Gold Shares (GLD)' },
  ];
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  ];

  try {
    // Fetch stocks from Alpha Vantage (if API key configured)
    const stockPromises = stocks.map(async (s) => {
      try {
        const data = await fetchAlphaVantageGlobalQuote(s.symbol);
        if (data) {
          return { symbol: s.symbol, name: s.name, price: data.price, changePct: data.changePct };
        }
      } catch (_e) {
        // fall through to mock
      }
      // Fallback mock if no key or error
      return { symbol: s.symbol, name: s.name, price: 100, changePct: 0 };
    });

    // Fetch coins from CoinGecko
    let coinResults = {};
    try {
      coinResults = await fetchCoinGeckoSimplePrice(coins.map((c) => c.id));
    } catch (_e) {
      coinResults = {};
    }

    const coinItems = coins.map((c) => {
      const entry = coinResults[c.id];
      if (entry) {
        return {
          symbol: c.symbol,
          name: c.name,
          price: Number(entry.usd),
          changePct: Number(entry.usd_24h_change?.toFixed(2) || 0),
        };
      }
      // fallback mock
      return { symbol: c.symbol, name: c.name, price: 0, changePct: 0 };
    });

    const stockItems = await Promise.all(stockPromises);
    const items = [...stockItems, ...coinItems];

    res.json({ items, updatedAt: nowIso() });
  } catch (e) {
    // As a last resort, respond with previous static mock
    res.json({
      items: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 232.15, changePct: 0.85 },
        { symbol: 'BTC', name: 'Bitcoin', price: 61234.5, changePct: -1.23 },
        { symbol: 'SPY', name: 'S&P 500 ETF', price: 512.34, changePct: 0.42 },
        { symbol: 'ETH', name: 'Ethereum', price: 3189.2, changePct: 2.14 },
        { symbol: 'GLD', name: 'SPDR Gold Shares', price: 187.3, changePct: -0.12 },
      ],
      updatedAt: nowIso(),
      error: String(e && e.message ? e.message : e),
    });
  }
});

// GET /alpha — Easter egg
app.get('/alpha', (_req, res) => {
  const tips = [
    'Pagate primero: apartá 10% apenas cobrás.',
    'Diversificá: reduce riesgo no sistemático.',
    'Tiempo en el mercado > timing del mercado.',
    'Costos bajos (TER) mejoran el retorno neto.',
    'Rebalanceá para mantener tu riesgo objetivo.',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.set('X-Monetix-Alpha', 'true');
  res.json({ tip, updatedAt: nowIso() });
});

// GET /news (mock)
app.get('/news', (_req, res) => {
  res.json({
    items: [
      {
        id: 'n1',
        title: 'Banco central mantiene tasas sin cambios',
        summary: 'La autoridad monetaria dejó la tasa de referencia estable y señaló cautela.',
        url: 'https://example.com/news/central-bank',
        source: 'Example Finance',
        publishedAt: nowIso(),
      },
      {
        id: 'n2',
        title: 'Resultados trimestrales mixtos en grandes tecnológicas',
        summary: 'Ingresos por encima de lo esperado, pero guidance conservador para el próximo trimestre.',
        url: 'https://example.com/news/earnings',
        source: 'Example Markets',
        publishedAt: nowIso(),
      },
    ],
    updatedAt: nowIso(),
  });
});

// GET /daily-message (mock)
app.get('/daily-message', (_req, res) => {
  res.json({
    date: new Date().toISOString().slice(0, 10),
    message:
      'Consejo: Diversifica tu portafolio. No pongas todos los huevos en la misma canasta.',
    shareText:
      'Mensaje financiero del día: Diversifica tu portafolio para reducir riesgos.',
    updatedAt: nowIso(),
  });
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'monetix-backend', updatedAt: nowIso() });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MONETIX backend running on http://localhost:${PORT}`);
});
