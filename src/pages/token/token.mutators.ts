import { mutator } from "satcheljs";
import { candlesLoaded, chartFailed, chartLoading, depthUpdated, klineUpdated } from "./token.actions";
import chartStore from "./token.store";
import { klineWsToCandle } from "./token.types";

mutator(chartLoading, ({ symbol, interval }) => {
  chartStore().symbol = symbol;
  chartStore().interval = interval;
  chartStore().isLoading = true;
  chartStore().error = null;
  chartStore().candles = [];
});

mutator(candlesLoaded, ({ candles }) => {
  chartStore().candles = candles;
  chartStore().isLoading = false;
});

mutator(chartFailed, ({ error }) => {
  chartStore().error = error;
  chartStore().isLoading = false;
});

mutator(depthUpdated, ({ bids, asks }) => {
  chartStore().bids = bids;
  chartStore().asks = asks;
});

mutator(klineUpdated, ({ payload }) => {
  const candles = chartStore().candles;
  if (candles.length === 0) return;

  const candle = klineWsToCandle(payload.k);

  if (payload.k.x) {
    candles.push(candle);
  } else {
    candles.splice(candles.length - 1, 1, candle);
  }
});
