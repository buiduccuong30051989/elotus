import { runInAction } from "mobx";
import { mutator } from "satcheljs";
import { pairsFailed, pairsLoaded, pairsLoading, pricesUpdated } from "./dashboard.actions";
import marketStore from "./dashboard.store";

mutator(pairsLoading, () => {
  marketStore().isLoading = true;
  marketStore().error = null;
});

mutator(pairsLoaded, ({ pairs }) => {
  marketStore().pairs = pairs;
  marketStore().isLoading = false;
});

mutator(pairsFailed, ({ error }) => {
  marketStore().error = error;
  marketStore().isLoading = false;
});

mutator(pricesUpdated, ({ tickers }) => {
  // !miniTicker@arr only pushes symbols with price changes per tick, not all symbols.
  // ref: https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams
  const map = new Map(tickers.map((t) => [t.s, t]));

  for (const pair of marketStore().pairs) {
    const ticker = map.get(pair.symbol);
    if (!ticker) continue;

    const prev = Number.parseFloat(pair.lastPrice);
    const next = Number.parseFloat(ticker.c);

    if (next !== prev) {
      pair.direction = next > prev ? "up" : "down";
      setTimeout(() => runInAction(() => { pair.direction = undefined; }), 800);
    }

    pair.lastPrice = ticker.c;
    pair.priceChangePercent = (
      ((Number.parseFloat(ticker.c) - Number.parseFloat(ticker.o)) / Number.parseFloat(ticker.o)) *
      100
    ).toFixed(2);
  }
});
