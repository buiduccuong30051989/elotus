import { memo } from "react";
import { observer } from "mobx-react-lite";
import { StarIcon } from "lucide-react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import type { CryptoPair } from "../dashboard.types";

interface Props {
  pair: CryptoPair;
  isFav: boolean;
  onRowClick: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

const PairRow = memo(
  observer(function PairRow({ pair, isFav, onRowClick, onToggleFavorite }: Props) {
    return (
      <TableRow
        onClick={() => onRowClick(pair.symbol)}
        className={
          pair.direction === "up"
            ? "flash-green cursor-pointer flex items-center"
            : pair.direction === "down"
              ? "flash-red cursor-pointer flex items-center"
              : "cursor-pointer flex items-center"
        }
        style={{ height: 48 }}
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
