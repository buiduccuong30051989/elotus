export interface Ticker24hr {
  symbol: string; // e.g. "BTCUSDT"
  lastPrice: string; // current price
  priceChangePercent: string; // 24h change, e.g. "-1.23"
}

export interface MiniTickerPayload {
  e: string; // event type: "24hrMiniTicker"
  E: number; // event time (ms)
  s: string; // symbol
  c: string; // current price (close)
  o: string; // open price 24h ago
  h: string; // high
  l: string; // low
  v: string; // base asset volume
  q: string; // quote asset volume
}

export type FlashDirection = "up" | "down";
