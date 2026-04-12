## Tech Stack

| Category | Choice |
|---|---|
| Language | TypeScript 5 (strict) |
| Framework | React 19 + Vite |
| State Management | MobX + SatchelJS |
| HTTP Client | axios |
| Real-time | Native WebSocket API |
| Charting | Lightweight Charts (TradingView) |
| Styling | TailwindCSS v4 |
| i18n | react-i18next |
| Routing | React Router v6 |
| Linting & Formatting | Biome |

## Getting Started

**Requirements:** Node.js 24+ (pinned via Volta)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  types/          # TypeScript interfaces for API responses, WS payloads, store shapes
  store/          # SatchelJS stores (marketStore, chartStore, settingsStore)
  actions/        # SatchelJS actions — describe what happened
  mutators/       # SatchelJS mutators — pure functions that update the store
  orchestrators/  # Side effects: REST fetches, WebSocket connect/disconnect
  services/       # Binance REST (axios) and WebSocket service wrappers
  components/     # Reusable UI components
  pages/          # Dashboard, TokenDetail
  i18n/           # Locale files (en, vi)
  hooks/          # Custom React hooks
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check and build for production
npm run preview   # Preview production build locally
npm run lint      # Lint with Biome
npm run format    # Auto-format with Biome
npm run check     # Lint + format check combined
```

## Data Sources

All data comes from the public Binance API — no API key required.

- **REST:** `https://api.binance.com/api/v3`
- **WebSocket:** `wss://stream.binance.com:9443/ws`
