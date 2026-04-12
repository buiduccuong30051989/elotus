import { CandlestickSeries, type IChartApi, type ISeriesApi, createChart } from "lightweight-charts";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { chartLoading, chartUnmounted } from "../actions/chartActions";
import "../mutators/chartMutators";
import "../orchestrators/chartWs";
import "../orchestrators/loadChart";
import chartStore from "../store/chartStore";
import type { Interval } from "../types/chart";

const INTERVALS: Interval[] = ["1m", "15m", "1h", "4h", "1d"];

const TokenDetail = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const store = chartStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!symbol) return;
    chartLoading(symbol, store.interval);
    return () => { chartUnmounted(); };
  }, [symbol, store.interval]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
    });
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);

    // candles replaced (initial load or interval change) → setData
    // only fires on 0 → N transition, not on tick append
    const disposeLoad = reaction(
      () => chartStore().candles.length,
      (length, prevLength) => {
        if (length === 0 || prevLength !== 0) return;
        seriesRef.current?.setData(chartStore().candles.slice());
        chartRef.current?.timeScale().fitContent();
      }
    );

    // last candle changed (WS tick) → series.update
    const disposeTick = reaction(
      () => {
        const candles = chartStore().candles;
        return candles.length > 0 ? candles[candles.length - 1] : null;
      },
      (lastCandle) => {
        if (lastCandle) seriesRef.current?.update(lastCandle);
      }
    );

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      disposeLoad();
      disposeTick();
    };
  }, []);

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
      <div ref={containerRef} />
    </div>
  );
});

export default TokenDetail;
