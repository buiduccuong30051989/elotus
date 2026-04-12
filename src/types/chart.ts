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
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type Interval = "1m" | "15m" | "1h" | "4h" | "1d";

export function toCandle(k: KlineRaw): Candle {
  return {
    time: k[0] / 1000,
    open: Number.parseFloat(k[1]),
    high: Number.parseFloat(k[2]),
    low: Number.parseFloat(k[3]),
    close: Number.parseFloat(k[4]),
  };
}
