export interface Ticker24hrRaw {
  symbol: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
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

export interface CryptoPair {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  direction?: FlashDirection | undefined;
}

export type FlashDirection = "up" | "down";
