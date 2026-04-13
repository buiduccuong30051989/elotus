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

The project uses a **domain/feature folder structure** — each page owns its SatchelJS files (store, actions, mutators, orchestrators, types) collocated in its own folder rather than split into global `store/`, `actions/`, `mutators/` layers. This keeps all files related to a feature together and makes it easier to navigate when working on a single domain.

```
src/
  pages/
    dashboard/               # domain: market list
      components/            # PairsTable, PairRow, SearchInput
      dashboard.store.ts
      dashboard.actions.ts
      dashboard.mutators.ts
      dashboard.orchestrators.ts
      dashboard.types.ts
      index.tsx
    token/                   # domain: token detail + chart
      components/            # CandlestickChart
      hooks/                 # useChart
      token.store.ts
      token.actions.ts
      token.mutators.ts
      token.orchestrators.ts
      token.types.ts
      index.tsx
  settings/                  # cross-cutting domain: language, theme, avatar, favorites
  shared/
    components/ui/           # shadcn/ui primitives (button, command, sonner, table)
    components/              # AppHeader, ErrorBoundary
    services/                # binanceRest.ts, binanceWs.ts — pure, no React/store imports
    lib/                     # utils.ts
  styles/
    index.css                # entry point
    tailwind.css             # @import tailwindcss + @theme tokens + fonts
    theme.css                # :root and .dark CSS variable tokens
    globals.css              # @layer base resets + keyframe animations
    components/              # AppHeader.css, SearchInput.css
    pages/                   # dashboard.css, token.css
  i18n/                      # en.json, vi.json
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

### WebSocket

`BinanceWs` (`src/services/binanceWs.ts`) is a thin wrapper around the native `WebSocket` API. It handles one stream per instance and is intentionally kept free of React and store dependencies.

**Reconnect strategy:** On `onclose`, it schedules a reconnect with exponential backoff starting at 1s, capped at 30s. `onerror` closes the socket immediately to trigger the same path. Calling `disconnect()` sets a `stopped` flag so the reconnect loop doesn't fire after an intentional teardown (e.g. component unmount).