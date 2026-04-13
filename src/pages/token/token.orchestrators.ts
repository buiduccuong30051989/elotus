import { orchestrator } from "satcheljs";
import { candlesLoaded, chartFailed, chartLoading, chartUnmounted, depthUpdated, klineUpdated } from "./token.actions";
import { fetchKlines } from "@/shared/services/binanceRest";
import { BinanceWs } from "@/shared/services/binanceWs";
import { toCandle } from "./token.types";
import type { DepthRaw, KlineWsPayload } from "./token.types";

orchestrator(chartLoading, async ({ symbol, interval }) => {
  try {
    const raw = await fetchKlines(symbol, interval);
    candlesLoaded(raw.map(toCandle));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load chart";
    chartFailed(message);
  }
});

let ws: BinanceWs | null = null;
let depthWs: BinanceWs | null = null;
let depthTimer: ReturnType<typeof setTimeout> | null = null;
let latestDepth: DepthRaw | null = null;

orchestrator(chartLoading, ({ symbol, interval }) => {
  ws?.disconnect();
  ws = new BinanceWs(`${symbol.toLowerCase()}@kline_${interval}`, (data) => {
    klineUpdated(data as KlineWsPayload);
  });
  ws.connect();

  depthWs?.disconnect();
  latestDepth = null;
  depthWs = new BinanceWs(`${symbol.toLowerCase()}@depth20@100ms`, (data) => {
    latestDepth = data as DepthRaw;
    if (!depthTimer) {
      depthTimer = setTimeout(() => {
        if (latestDepth) {
          depthUpdated(
            latestDepth.bids.map(([price, qty]) => ({ price, qty })),
            latestDepth.asks.map(([price, qty]) => ({ price, qty })),
          );
        }
        depthTimer = null;
      }, 200);
    }
  });
  depthWs.connect();
});

orchestrator(chartUnmounted, () => {
  ws?.disconnect();
  ws = null;
  depthWs?.disconnect();
  depthWs = null;
  if (depthTimer) { clearTimeout(depthTimer); depthTimer = null; }
  latestDepth = null;
});
