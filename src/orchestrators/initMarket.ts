import { orchestrator } from "satcheljs";
import { pairsFailed, pairsLoaded, pairsLoading } from "../actions/marketActions";
import { fetchTickers } from "../services/binanceRest";

export const initMarketOrchestrator = orchestrator(pairsLoading, async () => {
  try {
    const tickers = await fetchTickers();
    const pairs = tickers.filter((t) => t.symbol.endsWith("USDT"));
    pairsLoaded(pairs);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch market data";
    pairsFailed(message);
  }
});
