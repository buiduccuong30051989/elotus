import { orchestrator } from "satcheljs";
import { connectPriceStream, disconnectPriceStream, pairsFailed, pairsLoaded, pairsLoading, pricesUpdated } from "./dashboard.actions";
import { fetchTickers } from "@/shared/services/binanceRest";
import { BinanceWs } from "@/shared/services/binanceWs";
import type { MiniTickerPayload } from "./dashboard.types";

orchestrator(pairsLoading, async () => {
  try {
    const tickers = await fetchTickers();
    const pairs = tickers
      .filter((t) => t.symbol && Number.parseFloat(t.lastPrice) > 0)
      .map((t) => ({
        symbol: t.symbol,
        lastPrice: t.lastPrice,
        priceChangePercent: (
          ((Number.parseFloat(t.lastPrice) - Number.parseFloat(t.openPrice)) /
            Number.parseFloat(t.openPrice)) *
          100
        ).toFixed(2),
      }));
    pairsLoaded(pairs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch market data";
    pairsFailed(message);
  }
});

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
