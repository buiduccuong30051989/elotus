import { orchestrator } from "satcheljs";
import { pairsFailed, pairsLoaded, pairsLoading } from "../actions/marketActions";
import { fetchTickers } from "../services/binanceRest";

export const initMarketOrchestrator = orchestrator(pairsLoading, async () => {
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
