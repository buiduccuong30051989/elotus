import { orchestrator } from "satcheljs";
import { candlesLoaded, chartFailed, chartLoading } from "../actions/chartActions";
import { fetchKlines } from "../services/binanceRest";
import { toCandle } from "../types/chart";

orchestrator(chartLoading, async ({ symbol, interval }) => {
  try {
    const raw = await fetchKlines(symbol, interval);
    candlesLoaded(raw.map(toCandle));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load chart";
    chartFailed(message);
  }
});
