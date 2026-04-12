import { orchestrator } from "satcheljs";
import { chartLoading, chartUnmounted, klineUpdated } from "../actions/chartActions";
import { BinanceWs } from "../services/binanceWs";
import type { KlineWsPayload } from "../types/chart";

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
