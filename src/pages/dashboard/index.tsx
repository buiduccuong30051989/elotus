import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/pages/dashboard.css";
import "@/settings/settings.mutators";
import "./dashboard.mutators";
import "./dashboard.orchestrators";
import { connectPriceStream, disconnectPriceStream, pairsLoading } from "./dashboard.actions";
import marketStore from "./dashboard.store";
import settingsStore from "@/settings/settings.store";
import SearchInput from "./components/SearchInput";

const Dashboard = observer(() => {
  const navigate = useNavigate();
  const store = marketStore();
  const settings = settingsStore();
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    pairsLoading();
    connectPriceStream();
    return () => {
      disconnectPriceStream();
    };
  }, []);

  const favSet = new Set(settings.favorites);
  const q = debouncedQuery.toLowerCase();
  const filtered = q ? store.pairs.filter((p) => p.symbol.toLowerCase().includes(q)) : store.pairs;
  const sorted = [
    ...filtered.filter((p) => favSet.has(p.symbol)),
    ...filtered.filter((p) => !favSet.has(p.symbol)),
  ];

  if (store.isLoading) return <p>Loading...</p>;
  if (store.error) return <p>Error: {store.error}</p>;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <SearchInput
          onChange={setDebouncedQuery}
          onSelect={(symbol) => navigate(`/token/${symbol}`)}
          placeholder="Search symbol..."
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h %</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((pair) => (
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
    </div>
  );
});

export default Dashboard;
