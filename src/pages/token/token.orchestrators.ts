import { orchestrator } from "satcheljs";
import { candlesLoaded, chartFailed, chartLoading, chartUnmounted, klineUpdated } from "./token.actions";
import { fetchKlines } from "@/shared/services/binanceRest";
import { BinanceWs } from "@/shared/services/binanceWs";
import { toCandle } from "./token.types";
import type { KlineWsPayload } from "./token.types";

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

orchestrator(chartLoading, ({ symbol, interval }) => {
  ws?.disconnect();

  ws = new BinanceWs(`${symbol.toLowerCase()}@kline_${interval}`, (data) => {
    klineUpdated(data as KlineWsPayload);
  });
  ws.connect();
});

orchestrator(chartUnmounted, () => {
  ws?.disconnect();
  ws = null;
});
