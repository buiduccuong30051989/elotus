import { createStore } from "satcheljs";
import type { CryptoPair } from "./dashboard.types";

interface MarketStore {
  pairs: CryptoPair[];
  isLoading: boolean;
  error: string | null;
}

const marketStore = createStore<MarketStore>("marketStore", {
  pairs: [],
  isLoading: false,
  error: null,
});

export default marketStore;

/*
 * SatchelJS flow — market data
 *
 *  [Component]                      pages/dashboard/index.tsx
 *      │ dispatch
 *      ▼
 *  pairsLoading()                   pages/dashboard/dashboard.actions.ts
 *      │
 *      ├──▶ [Mutator]               pages/dashboard/dashboard.mutators.ts   sets isLoading = true
 *      │
 *      └──▶ [Orchestrator]          pages/dashboard/dashboard.orchestrators.ts  fetchTickers() via REST
 *               │                   shared/services/binanceRest.ts
 *               │
 *               ├── ok  ──▶ pairsLoaded(pairs)
 *               │                │
 *               │                └──▶ [Mutator]   pairs = payload, isLoading = false
 *               │
 *               └── err ──▶ pairsFailed(msg)
 *                                │
 *                                └──▶ [Mutator]   error = msg, isLoading = false
 *
 *  marketStore (MobX observable)    ──▶ observer() components re-render
 */
