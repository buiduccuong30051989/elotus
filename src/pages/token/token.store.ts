import { createStore } from "satcheljs";
import type { Candle, Interval } from "./token.types";

interface ChartStore {
  candles: Candle[];
  symbol: string;
  interval: Interval;
  isLoading: boolean;
  error: string | null;
}

const chartStore = createStore<ChartStore>("chartStore", {
  candles: [],
  symbol: "",
  interval: "15m",
  isLoading: false,
  error: null,
});

export default chartStore;
