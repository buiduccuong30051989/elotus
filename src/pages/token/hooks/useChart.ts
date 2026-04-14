import { CandlestickSeries, type IChartApi, type ISeriesApi, createChart } from "lightweight-charts";
import { reaction } from "mobx";
import { type RefObject, useEffect, useRef } from "react";
import chartStore from "../token.store";

export function useChart(containerRef: RefObject<HTMLDivElement | null>) {
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
    });

    const ro = new ResizeObserver(() => {
      chart.resize(el.clientWidth, el.clientHeight);
    });
    ro.observe(el);
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);

    const existing = chartStore().candles.slice();
    if (existing.length > 0) {
      seriesRef.current?.setData(existing);
      chartRef.current?.timeScale().fitContent();
    }

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
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      disposeLoad();
      disposeTick();
    };
  }, [containerRef]);
}
