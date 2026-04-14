import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import chartStore from "../token.store";

const SKELETON_ROWS = 10;
const SKELETON_WIDTHS = ["w-20", "w-24", "w-16", "w-20", "w-28", "w-18", "w-22", "w-20", "w-16", "w-24"];

const OrderBook = observer(() => {
  const { t } = useTranslation();
  const { bids, asks } = chartStore();
  const [activeSide, setActiveSide] = useState<"bids" | "asks">("bids");
  const isLoading = bids.length === 0 && asks.length === 0;

  const renderSkeletonRows = () =>
    Array.from({ length: SKELETON_ROWS }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton
      <tr key={i} className="order-book__row">
        <td className="order-book__td">
          <div className={`h-3 ${SKELETON_WIDTHS[i]} animate-pulse rounded bg-muted`} />
        </td>
        <td className="order-book__td order-book__td--right">
          <div className="h-3 w-14 animate-pulse rounded bg-muted ml-auto" />
        </td>
      </tr>
    ));

  return (
    <div className="order-book__grid">
      <div className="order-book__tabs">
        <button
          type="button"
          className={`order-book__tab${activeSide === "bids" ? " order-book__tab--active" : ""}`}
          onClick={() => setActiveSide("bids")}
        >
          {t("orderBook.bids")}
        </button>
        <button
          type="button"
          className={`order-book__tab${activeSide === "asks" ? " order-book__tab--active" : ""}`}
          onClick={() => setActiveSide("asks")}
        >
          {t("orderBook.asks")}
        </button>
      </div>
      <div className={`order-book__side${activeSide !== "bids" ? " order-book__side--hidden" : ""}`}>
        <table className="order-book__table">
          <thead>
            <tr>
              <th className="order-book__th">{t("orderBook.price")}</th>
              <th className="order-book__th order-book__th--right">{t("orderBook.qty")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? renderSkeletonRows()
              : bids.slice(0, 15).map((level) => (
                  <tr key={level.price} className="order-book__row order-book__row--bid">
                    <td className="order-book__td">{level.price}</td>
                    <td className="order-book__td order-book__td--right">{level.qty}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <div className={`order-book__side${activeSide !== "asks" ? " order-book__side--hidden" : ""}`}>
        <table className="order-book__table">
          <thead>
            <tr>
              <th className="order-book__th">{t("orderBook.price")}</th>
              <th className="order-book__th order-book__th--right">{t("orderBook.qty")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? renderSkeletonRows()
              : asks.slice(0, 15).map((level) => (
                  <tr key={level.price} className="order-book__row order-book__row--ask">
                    <td className="order-book__td">{level.price}</td>
                    <td className="order-book__td order-book__td--right">{level.qty}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default OrderBook;
