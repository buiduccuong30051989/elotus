import { useEffect, useRef, useState } from "react";

interface Props {
  onChange: (query: string) => void;
  placeholder?: string;
}

function SearchInput({ onChange, placeholder }: Props) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(value), 200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onChange]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default SearchInput;
