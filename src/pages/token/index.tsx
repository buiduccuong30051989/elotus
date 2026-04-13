import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "@/styles/pages/token.css";
import { chartLoading, chartUnmounted } from "./token.actions";
import CandlestickChart from "./components/CandlestickChart";
import "./token.mutators";
import "./token.orchestrators";
import chartStore from "./token.store";
import type { Interval } from "./token.types";

const INTERVALS: Interval[] = ["1m", "15m", "1h", "4h", "1d"];

const TokenDetail = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const store = chartStore();

  useEffect(() => {
    if (!symbol) return;
    chartLoading(symbol, store.interval);
    return () => { chartUnmounted(); };
  }, [symbol, store.interval]);

  return (
    <div>
      <p>{symbol}</p>
      <div>
        {INTERVALS.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => symbol && chartLoading(symbol, i)}
          >
            {i}
          </button>
        ))}
      </div>
      {store.isLoading && <p>Loading...</p>}
      {store.error && <p>Error: {store.error}</p>}
      <CandlestickChart />
    </div>
  );
});

export default TokenDetail;
