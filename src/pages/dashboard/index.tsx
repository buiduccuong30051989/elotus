import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "@/styles/pages/dashboard.css";
import "@/settings/settings.mutators";
import "./dashboard.mutators";
import "./dashboard.orchestrators";
import { connectPriceStream, disconnectPriceStream, pairsLoading } from "./dashboard.actions";
import { toggleFavorite } from "@/settings/settings.actions";
import marketStore from "./dashboard.store";
import settingsStore from "@/settings/settings.store";
import SearchInput from "./components/SearchInput";
import PairsTable from "./components/PairsTable";

const Dashboard = observer(() => {
  const { t } = useTranslation();
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

  useEffect(() => {
    if (store.error) toast.error(store.error);
  }, [store.error]);

  const favSet = new Set(settings.favorites);
  const q = debouncedQuery.toLowerCase();
  const filtered = q ? store.pairs.filter((p) => p.symbol.toLowerCase().includes(q)) : store.pairs;
  const sorted = [
    ...filtered.filter((p) => favSet.has(p.symbol)),
    ...filtered.filter((p) => !favSet.has(p.symbol)),
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__container container">
        <div className="dashboard__header">
          <SearchInput
            onChange={setDebouncedQuery}
            onSelect={(symbol) => navigate(`/token/${symbol}`)}
            placeholder={t("dashboard.searchPlaceholder")}
          />
        </div>
        <PairsTable
          pairs={sorted}
          favorites={favSet}
          isLoading={store.isLoading}
          onRowClick={(symbol) => navigate(`/token/${symbol}`)}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
});

export default Dashboard;
