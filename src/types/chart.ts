import type { UTCTimestamp } from "lightweight-charts";

// Raw response from /klines — array of arrays
export type KlineRaw = [
  number,  // open time
  string,  // open
  string,  // high
  string,  // low
  string,  // close
  string,  // volume
  number,  // close time
  string,  // quote asset volume
  number,  // number of trades
  string,  // taker buy base volume
  string,  // taker buy quote volume
  string,  // unused
];

export interface Candle {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type Interval = "1m" | "15m" | "1h" | "4h" | "1d";

export interface KlineWsPayload {
  s: string; // symbol
  k: {
    t: number;  // candle open time (ms)
    T: number;  // candle close time (ms)
    o: string;  // open price
    h: string;  // high price
    l: string;  // low price
    c: string;  // close price
    v: string;  // base asset volume
    n: number;  // number of trades
    x: boolean; // is candle closed — false = still forming, true = closed (append new candle)
  };
}

export function toCandle(k: KlineRaw): Candle {
  return {
    time: (k[0] / 1000) as UTCTimestamp,
    open: Number.parseFloat(k[1]),
    high: Number.parseFloat(k[2]),
    low: Number.parseFloat(k[3]),
    close: Number.parseFloat(k[4]),
  };
}

export function klineWsToCandle(k: KlineWsPayload["k"]): Candle {
  return {
    time: (k.t / 1000) as UTCTimestamp,
    open: Number.parseFloat(k.o),
    high: Number.parseFloat(k.h),
    low: Number.parseFloat(k.l),
    close: Number.parseFloat(k.c),
  };
}
