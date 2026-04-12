import { action } from "satcheljs";
import type { Candle, Interval } from "../types/chart";

export const chartLoading = action("chartLoading", (symbol: string, interval: Interval) => ({ symbol, interval }));
export const candlesLoaded = action("candlesLoaded", (candles: Candle[]) => ({ candles }));
export const chartFailed = action("chartFailed", (error: string) => ({ error }));
