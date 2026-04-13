import { createStore } from "satcheljs";
import type { Candle, DepthLevel, Interval } from "./token.types";

interface ChartStore {
  candles: Candle[];
  symbol: string;
  interval: Interval;
  isLoading: boolean;
  error: string | null;
  bids: DepthLevel[];
  asks: DepthLevel[];
}

const chartStore = createStore<ChartStore>("chartStore", {
  candles: [],
  symbol: "",
  interval: "15m",
  isLoading: false,
  error: null,
  bids: [],
  asks: [],
});

export default chartStore;
