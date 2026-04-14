import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import "@/styles/pages/token.css";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import { chartLoading, chartUnmounted } from "./token.actions";
import CandlestickChart from "./components/CandlestickChart";
import OrderBook from "./components/OrderBook";
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
    return () => {
      chartUnmounted();
    };
  }, [symbol, store.interval]);

  useEffect(() => {
    if (store.error) toast.error(store.error);
  }, [store.error]);

  return (
    <div className="token-detail">
      <div className="token-detail__container container">
        <div className="token-detail__controls">
          <span className="token-detail__symbol">{symbol}</span>
          {INTERVALS.map((i) => (
            <button
              key={i}
              type="button"
              className={`token-detail__interval-btn${store.interval === i ? " token-detail__interval-btn--active" : ""}`}
              onClick={() => symbol && chartLoading(symbol, i)}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="token-detail__chart">
          <ErrorBoundary>
            {store.isLoading ? (
              <div className="token-detail__chart-skeleton" />
            ) : (
              <CandlestickChart />
            )}
          </ErrorBoundary>
        </div>
        <div className="token-detail__depth">
          <ErrorBoundary>
            <OrderBook />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
});

export default TokenDetail;
