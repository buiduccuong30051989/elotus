import { CandlestickSeries, type IChartApi, type ISeriesApi, createChart } from "lightweight-charts";
import { reaction } from "mobx";
import { type RefObject, useEffect, useRef } from "react";
import chartStore from "../token.store";

export function useChart(containerRef: RefObject<HTMLDivElement | null>) {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
    });
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);

    const disposeLoad = reaction(
      () => chartStore().candles.length,
      (length, prevLength) => {
        if (length === 0 || prevLength !== 0) return;
        seriesRef.current?.setData(chartStore().candles.slice());
        chartRef.current?.timeScale().fitContent();
      }
    );

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
  }, [containerRef]);
}
