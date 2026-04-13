import { memo } from "react";
import { observer } from "mobx-react-lite";
import { StarIcon } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import type { CryptoPair } from "../dashboard.types";

interface Props {
  pair: CryptoPair;
  isFav: boolean;
  start: number;
  onRowClick: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

const PairRow = memo(
  observer(function PairRow({ pair, isFav, start, onRowClick, onToggleFavorite }: Props) {
    return (
      <TableRow
        onClick={() => onRowClick(pair.symbol)}
        className={
          pair.direction === "up"
            ? "flash-green cursor-pointer"
            : pair.direction === "down"
              ? "flash-red cursor-pointer"
              : "cursor-pointer"
        }
        style={{
          position: "absolute",
          top: 0,
          transform: `translateY(${start}px)`,
          width: "100%",
          height: "48px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <TableCell className="flex-[5]">{pair.symbol}</TableCell>
        <TableCell className="flex-[4]">{pair.lastPrice}</TableCell>
        <TableCell
          className={`flex-[3] ${Number(pair.priceChangePercent) >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {pair.priceChangePercent}%
        </TableCell>
        <TableCell className="w-12 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(pair.symbol);
            }}
          >
            <StarIcon className="size-4" fill={isFav ? "currentColor" : "none"} />
          </button>
        </TableCell>
      </TableRow>
    );
  }),
);

export default PairRow;
