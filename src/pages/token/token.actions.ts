import { action } from "satcheljs";
import type { Candle, Interval, KlineWsPayload } from "./token.types";

export const chartLoading = action("chartLoading", (symbol: string, interval: Interval) => ({ symbol, interval }));
export const candlesLoaded = action("candlesLoaded", (candles: Candle[]) => ({ candles }));
export const chartFailed = action("chartFailed", (error: string) => ({ error }));
export const klineUpdated = action("klineUpdated", (payload: KlineWsPayload) => ({ payload }));
export const chartUnmounted = action("chartUnmounted");
