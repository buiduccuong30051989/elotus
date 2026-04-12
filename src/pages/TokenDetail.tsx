import { CandlestickSeries, createChart } from "lightweight-charts";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { chartLoading } from "../actions/chartActions";
import "../mutators/chartMutators";
import "../orchestrators/loadChart";
import chartStore from "../store/chartStore";
import type { Interval } from "../types/chart";

const INTERVALS: Interval[] = ["1m", "15m", "1h", "4h", "1d"];

const TokenDetail = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const store = chartStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol) return;
    chartLoading(symbol, "15m");
  }, [symbol]);

  useEffect(() => {
    if (!containerRef.current || store.candles.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addSeries(CandlestickSeries);
    series.setData(store.candles);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [store.candles]);

  if (store.isLoading) return <p>Loading...</p>;
  if (store.error) return <p>Error: {store.error}</p>;

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
      <div ref={containerRef} />
    </div>
  );
});

export default TokenDetail;
