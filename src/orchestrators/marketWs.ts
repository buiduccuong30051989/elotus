import { orchestrator } from "satcheljs";
import { connectPriceStream, disconnectPriceStream, pricesUpdated } from "../actions/marketActions";
import { BinanceWs } from "../services/binanceWs";
import type { MiniTickerPayload } from "../types/market";

let ws: BinanceWs | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let pending: MiniTickerPayload[] = [];

orchestrator(connectPriceStream, () => {
  ws = new BinanceWs("!miniTicker@arr", (data) => {
    pending = data as MiniTickerPayload[];

    if (flushTimer) return;
    flushTimer = setTimeout(() => {
      const batch = pending;
      pending = [];
      flushTimer = null;
      pricesUpdated(batch);
    }, 200);
  });
  ws.connect();
});

orchestrator(disconnectPriceStream, () => {
  ws?.disconnect();
  ws = null;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  pending = [];
});

/*
 * SatchelJS flow — WebSocket price stream
 *
 *  [Component]                      pages/Dashboard.tsx
 *      │ connectPriceStream()
 *      ▼
 *  [Orchestrator]                   orchestrators/marketWs.ts
 *      │  BinanceWs("!miniTicker@arr")       services/binanceWs.ts
 *      │  onMessage → buffer pending[]
 *      │  setTimeout 200ms (throttle)
 *      │
 *      └──▶ pricesUpdated(batch)             actions/marketActions.ts
 *                │
 *                └──▶ [Mutator]              mutators/marketMutators.ts
 *                         build Map<symbol, ticker>
 *                         iterate store.pairs → update lastPrice, priceChangePercent
 *                         set priceDirection (up | down) — persists until next update
 *
 *  [Component unmount]              pages/Dashboard.tsx
 *      │ disconnectPriceStream()
 *      ▼
 *  [Orchestrator]                   orchestrators/marketWs.ts
 *      ws.disconnect() + clearTimeout
 *
 *  marketStore (MobX observable)    store/marketStore.ts
 *      pairs[]      → Ticker24hr { symbol, lastPrice, priceChangePercent }
 *      priceFlash   → Map<string, FlashDirection>  ("up" | "down")
 */
