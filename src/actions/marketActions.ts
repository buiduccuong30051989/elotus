import { action } from "satcheljs";
import type { MiniTickerPayload, Ticker24hr } from "../types/market";

export const pairsLoading = action("pairsLoading");

export const pairsLoaded = action("pairsLoaded", (pairs: Ticker24hr[]) => ({ pairs }));

export const pairsFailed = action("pairsFailed", (error: string) => ({ error }));

export const connectPriceStream = action("connectPriceStream");

export const disconnectPriceStream = action("disconnectPriceStream");

export const pricesUpdated = action("pricesUpdated", (tickers: MiniTickerPayload[]) => ({ tickers }));
