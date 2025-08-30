### MONETIX

Panel financiero que centraliza datos de mercados y economía, resume noticias en lenguaje simple y traduce señales en impactos prácticos para la vida diaria. Este repo contiene un MVP con frontend (React + Vite + Tailwind) y backend (Express) con endpoints reales/mock.

---

## Características (MVP)
- Dashboard con tarjetas:
  - Inflación (consume `/inflation`)
  - Tipo de cambio (mock en `/exchange-rate`)
  - Watchlist (consume `/assets` con datos reales para cripto vía CoinGecko y acciones/ETFs vía Alpha Vantage si hay API key)
  - Noticias (mock en `/news`)
  - Mensaje financiero del día (mock en `/daily-message`)
- Easter egg: Código Konami habilita "Modo Alfa" y trae un tip desde `/alpha`.

## Stack
- Frontend: React 19, Vite 7, TypeScript, Tailwind CSS v4 (PostCSS)
- Backend: Node + Express, `dotenv`, `cors`, `morgan`

## Estructura
```
.
├── backend/          # API Express
│   ├── server.js     # Endpoints (mock + integraciones reales)
│   ├── package.json
│   ├── .env          # Variables locales (no se versiona)
│   └── .gitignore
├── frontend/         # App React + Vite + Tailwind
│   ├── src/
│   ├── package.json
│   └── postcss.config.js
├── dev.sh            # Opcional: script para levantar ambos en paralelo
├── ideas.txt         # Notas de producto
├── todolist.md       # Roadmap por features (vertical slices)
└── README.md
```

## Requisitos
- Node.js
  - Backend: Node 18+ recomendado
  - Frontend (Vite 7): 20.19+ o 22.12+ recomendado (con 22.3 puede mostrar aviso)
- npm 10+

## Configuración rápida
Clonar el repo y entrar al proyecto:
```bash
git clone https://github.com/fredpyo/ia002.git
cd ia002
```

### Backend
1) Instalar dependencias:
```bash
cd backend
npm install
```
2) Variables de entorno (`backend/.env`):
```bash
cp .env.example .env
# Editar y completar si tenés claves:
# ALPHA_VANTAGE_API_KEY=tu_api_key
# COINGECKO_API_KEY=opcional
```
3) Correr en desarrollo:
```bash
npm run dev
# Servidor en http://localhost:3001
```

Endpoints principales:
- `GET /inflation` (mock)
- `GET /exchange-rate` (mock)
- `GET /assets` (real: CoinGecko para BTC/ETH; Alpha Vantage para AAPL/SPY/GLD si hay API key, caso contrario fallback)
- `GET /news` (mock)
- `GET /daily-message` (mock)
- `GET /alpha` (easter egg)

### Frontend
1) Instalar dependencias:
```bash
cd ../frontend
npm install
```
2) Correr en desarrollo:
```bash
npm run dev
# App en http://localhost:5173
```

Notas de estilos:
- Tailwind v4 vía PostCSS usando `@tailwindcss/postcss` y `@import "tailwindcss";` en `src/index.css`.

### Correr ambos a la vez (opcional)
```bash
./dev.sh
# Levanta backend (3001) y frontend (5173) en paralelo
```

## Variables de entorno (backend)
- `ALPHA_VANTAGE_API_KEY`: clave de Alpha Vantage (acciones/ETFs). Sin esto, `/assets` usa fallback para esos símbolos.
- `COINGECKO_API_KEY`: opcional, mejora límites de CoinGecko.
- `PORT`: puerto del backend (por defecto 3001).

## Roadmap
- Ver `todolist.md` para cortes verticales por feature y estado.

## Licencia
Pendiente.
