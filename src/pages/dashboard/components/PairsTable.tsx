import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import PairRow from "./PairRow";
import type { CryptoPair } from "../dashboard.types";

const SKELETON_COUNT = 12;
const ROW_HEIGHT = 48;

interface Props {
  pairs: CryptoPair[];
  favorites: Set<string>;
  isLoading?: boolean;
  onRowClick: (symbol: string) => void;
  onToggleFavorite: (symbol: string) => void;
}

function PairsTable({ pairs, favorites, isLoading, onRowClick, onToggleFavorite }: Props) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: pairs.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div className="dashboard__table-wrapper">
      <div ref={scrollRef} className="dashboard__scroll">
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="flex items-center">
              <TableHead className="flex flex-[5] items-center">{t("dashboard.symbol")}</TableHead>
              <TableHead className="flex flex-[4] items-center">{t("dashboard.price")}</TableHead>
              <TableHead className="flex flex-[3] items-center">{t("dashboard.change24h")}</TableHead>
              <TableHead className="w-12 shrink-0" />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableBody
              style={{
                position: "relative",
                height: `${SKELETON_COUNT * ROW_HEIGHT}px`,
              }}
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <TableRow
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    transform: `translateY(${i * ROW_HEIGHT}px)`,
                    width: "100%",
                    height: `${ROW_HEIGHT}px`,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TableCell className="flex-[5]">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="flex-[4]">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="flex-[3]">
                    <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                  </TableCell>
                  <TableCell className="w-12 shrink-0" />
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody
              style={{
                position: "relative",
                height: `${rowVirtualizer.getTotalSize()}px`,
              }}
            >
              {rowVirtualizer.getVirtualItems().map((vRow) => {
                const pair = pairs[vRow.index];
                return (
                  <PairRow
                    key={pair.symbol}
                    pair={pair}
                    isFav={favorites.has(pair.symbol)}
                    start={vRow.start}
                    onRowClick={onRowClick}
                    onToggleFavorite={onToggleFavorite}
                  />
                );
              })}
            </TableBody>
          )}
        </table>
      </div>
    </div>
  );
}

export default PairsTable;
