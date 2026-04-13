import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { StarIcon } from "lucide-react";
import debounce from "lodash/debounce";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import marketStore from "@/pages/dashboard/dashboard.store";
import settingsStore from "@/settings/settings.store";
import "@/styles/components/SearchInput.css";

interface Props {
  onChange: (debouncedQuery: string) => void;
  onSelect: (symbol: string) => void;
  placeholder?: string;
}

const SearchInput = observer(({ onChange, onSelect, placeholder }: Props) => {
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const emitDebounced = useRef(debounce((q: string) => onChange(q), 200)).current;

  const store = marketStore();
  const settings = settingsStore();
  const favSet = new Set(settings.favorites);

  useEffect(() => {
    emitDebounced(query);
  }, [query, emitDebounced]);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const liveQ = query.toLowerCase();
  const matches = query
    ? store.pairs.filter((p) => p.symbol.toLowerCase().includes(liveQ))
    : [];
  const suggestions = [
    ...matches.filter((p) => favSet.has(p.symbol)),
    ...matches.filter((p) => !favSet.has(p.symbol)),
  ].slice(0, 8);

  function handleSelect(symbol: string) {
    setQuery("");
    onSelect(symbol);
  }

  return (
    <div ref={wrapperRef} className="search-wrapper">
      <Command shouldFilter={false} className="search-cmd">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={placeholder}
        />
        {suggestions.length > 0 && (
          <CommandList className="search-cmd__list">
            <CommandGroup>
              {suggestions.map((pair) => (
                <CommandItem
                  key={pair.symbol}
                  value={pair.symbol}
                  onSelect={() => handleSelect(pair.symbol)}
                  className="search-cmd__item"
                >
                  <span>{pair.symbol}</span>
                  <span className="search-cmd__item-price">{pair.lastPrice}</span>
                  {favSet.has(pair.symbol) && <StarIcon className="search-cmd__star" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
});

export default SearchInput;
