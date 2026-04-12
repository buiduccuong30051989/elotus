import { action } from "satcheljs";
import type { CryptoPair, MiniTickerPayload } from "../types/market";

export const pairsLoading = action("pairsLoading");

export const pairsLoaded = action("pairsLoaded", (pairs: CryptoPair[]) => ({ pairs }));

export const pairsFailed = action("pairsFailed", (error: string) => ({ error }));

export const connectPriceStream = action("connectPriceStream");

export const disconnectPriceStream = action("disconnectPriceStream");

export const pricesUpdated = action("pricesUpdated", (tickers: MiniTickerPayload[]) => ({ tickers }));
