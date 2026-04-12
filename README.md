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

## Architecture

### Library roles

**MobX** is the reactive engine. It holds all application state as observable objects and automatically notifies any subscriber when a field changes.

**SatchelJS** sits on top of MobX and enforces a unidirectional data flow. It provides the Action → Mutator → Orchestrator pattern so that state is never mutated arbitrarily — every write goes through a mutator, every side effect goes through an orchestrator.

**mobx-react-lite** is the bridge between MobX and React. Its `observer()` wrapper tracks which store fields a component reads during render, then re-renders that component — and only that component — when those specific fields change.

### Data flow

```
┌─────────────────────────────────────────────────────────┐
│  React Component  (mobx-react-lite observer)            │
│  - reads store fields → re-renders when they change     │
│  - dispatches actions on user interaction / mount       │
└───────────────────────┬─────────────────────────────────┘
                        │ dispatch action
                        ▼
              ┌─────────────────┐
              │     Action      │  (SatchelJS)
              │  plain signal   │
              └────────┬────────┘
                       │ both listen to the same action
           ┌───────────┴────────────┐
           ▼                        ▼
  ┌────────────────┐     ┌──────────────────────┐
  │    Mutator     │     │     Orchestrator      │  (SatchelJS)
  │  sync, pure    │     │  async, side effects  │
  │  e.g. sets     │     │  calls Service        │
  │  isLoading=true│     │  (REST / WebSocket)   │
  └───────┬────────┘     └──────────┬────────────┘
          │                         │ dispatches next action
          │               ┌─────────┴──────────┐
          │               │      Action         │
          │               └─────────┬──────────┘
          │                         │
          │               ┌─────────┴──────────┐
          │               │      Mutator        │
          │               │  writes result      │
          │               │  to store           │
          │               └─────────┬──────────┘
          │                         │
          └───────────┬─────────────┘
                      ▼
          ┌───────────────────────┐
          │   Store               │  (MobX observable)
          │   single source of    │
          │   truth for all state │
          └───────────┬───────────┘
                      │ field changed → MobX notifies
                      ▼
          ┌───────────────────────┐
          │   React Component     │  re-renders automatically
          └───────────────────────┘
```

### Layer responsibilities

| Layer | Directory | Rule |
|---|---|---|
| **Store** | `store/` | MobX observable — defines state shape, initialized via `createStore` |
| **Action** | `actions/` | Plain signal — carries payload, contains zero logic |
| **Mutator** | `mutators/` | Synchronous, pure — only writes to the store |
| **Orchestrator** | `orchestrators/` | Owns all async/side effects — calls services, dispatches actions |
| **Service** | `services/` | Pure logic — no React, no store imports |
| **Component** | `pages/`, `components/` | Wrapped with `observer()`, dispatches actions, reads store |

Components never call services directly — all side effects go through the Action → Orchestrator → Service chain.

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
