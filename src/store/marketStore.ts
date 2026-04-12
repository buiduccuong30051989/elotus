import { createStore } from "satcheljs";
import type { Ticker24hr } from "../types/market";

interface MarketStore {
  pairs: Ticker24hr[];
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
 *  [Component]                      pages/Dashboard.tsx
 *      │ dispatch
 *      ▼
 *  pairsLoading()                   actions/marketActions.ts
 *      │
 *      ├──▶ [Mutator]               mutators/marketMutators.ts   sets isLoading = true
 *      │
 *      └──▶ [Orchestrator]          orchestrators/initMarket.ts  fetchTickers() via REST
 *               │                   services/binanceRest.ts
 *               │
 *               ├── ok  ──▶ pairsLoaded(pairs)                   actions/marketActions.ts
 *               │                │
 *               │                └──▶ [Mutator]                  mutators/marketMutators.ts   pairs = payload, isLoading = false
 *               │
 *               └── err ──▶ pairsFailed(msg)                     actions/marketActions.ts
 *                                │
 *                                └──▶ [Mutator]                  mutators/marketMutators.ts   error = msg, isLoading = false
 *
 *  marketStore (MobX observable)    store/marketStore.ts  ──▶ observer() components re-render
 */
