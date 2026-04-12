import { action } from "satcheljs";
import type { Ticker24hr } from "../types/market";

export const pairsLoading = action("pairsLoading");

export const pairsLoaded = action("pairsLoaded", (pairs: Ticker24hr[]) => ({ pairs }));

export const pairsFailed = action("pairsFailed", (error: string) => ({ error }));
