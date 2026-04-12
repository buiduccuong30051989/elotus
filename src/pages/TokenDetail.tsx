import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { chartLoading } from "../actions/chartActions";
import "../mutators/chartMutators";
import "../orchestrators/loadChart";
import chartStore from "../store/chartStore";

const TokenDetail = observer(() => {
  const { symbol } = useParams<{ symbol: string }>();
  const store = chartStore();

  useEffect(() => {
    if (!symbol) return;
    chartLoading(symbol, "15m");
  }, [symbol]);

  if (store.isLoading) return <p>Loading...</p>;
  if (store.error) return <p>Error: {store.error}</p>;

  return (
    <div>
      <p>{symbol}</p>
      <p>{store.candles.length} candles loaded</p>
    </div>
  );
});

export default TokenDetail;
