import axios from "axios";
import type { Ticker24hr } from "../types/market";

const client = axios.create({
  baseURL: import.meta.env.VITE_BINANCE_REST_URL,
  timeout: 10000,
});

export async function fetchTickers(): Promise<Ticker24hr[]> {
  const { data } = await client.get<Ticker24hr[]>("/ticker/24hr", {
    params: { type: "MINI" },
  });
  return data;
}
