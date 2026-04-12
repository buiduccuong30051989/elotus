import axios from "axios";
import type { Ticker24hrRaw } from "../types/market";

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
