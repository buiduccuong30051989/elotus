import axios from "axios";
import type { KlineRaw } from "@/pages/token/token.types";
import type { Ticker24hrRaw } from "@/pages/dashboard/dashboard.types";

const client = axios.create({
  baseURL: import.meta.env.VITE_BINANCE_REST_URL,
  timeout: 10000,
});

export async function fetchTickers(): Promise<Ticker24hrRaw[]> {
  const { data } = await client.get<Ticker24hrRaw[]>("/ticker/24hr", {
    params: { type: "MINI" },
  });
  return data;
}

export async function fetchKlines(symbol: string, interval: string): Promise<KlineRaw[]> {
  const { data } = await client.get<KlineRaw[]>("/klines", {
    params: { symbol, interval, limit: 500 },
  });
  return data;
}
