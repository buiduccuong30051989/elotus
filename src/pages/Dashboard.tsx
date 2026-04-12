import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../mutators/marketMutators";
import "../orchestrators/initMarket";
import "../orchestrators/marketWs";
import { connectPriceStream, disconnectPriceStream, pairsLoading } from "../actions/marketActions";
import marketStore from "../store/marketStore";

const Dashboard = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    pairsLoading();
    connectPriceStream();

    return () => {
      disconnectPriceStream();
    };
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
          <tr
            key={pair.symbol}
            onClick={() => navigate(`/token/${pair.symbol}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/token/${pair.symbol}`)}
          >
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
