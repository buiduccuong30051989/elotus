import { observer } from "mobx-react-lite";
import chartStore from "../token.store";

const OrderBook = observer(() => {
  const { bids, asks } = chartStore();

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.75rem", marginBottom: "0.25rem" }}>
            <span>Price</span><span>Qty</span>
          </div>
          {bids.slice(0, 15).map((level) => (
            <div key={level.price} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-green-500, #22c55e)", fontVariantNumeric: "tabular-nums" }}>
              <span>{level.price}</span><span>{level.qty}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.75rem", marginBottom: "0.25rem" }}>
            <span>Price</span><span>Qty</span>
          </div>
          {asks.slice(0, 15).map((level) => (
            <div key={level.price} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-red-500, #ef4444)", fontVariantNumeric: "tabular-nums" }}>
              <span>{level.price}</span><span>{level.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default OrderBook;
