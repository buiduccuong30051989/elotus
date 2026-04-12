import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import "../mutators/marketMutators";
import "../orchestrators/initMarket";
import { pairsLoading } from "../actions/marketActions";
import marketStore from "../store/marketStore";

const Dashboard = observer(() => {
  useEffect(() => {
    pairsLoading();
  }, []);

  const store = marketStore();

  if (store.isLoading) return <p>Loading...</p>;
  if (store.error) return <p>Error: {store.error}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>24h %</th>
        </tr>
      </thead>
      <tbody>
        {store.pairs.map((pair) => (
          <tr key={pair.symbol}>
            <td>{pair.symbol}</td>
            <td>{pair.lastPrice}</td>
            <td>{pair.priceChangePercent}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Dashboard;
