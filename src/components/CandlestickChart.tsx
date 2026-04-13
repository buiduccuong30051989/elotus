import { useRef } from "react";
import { useChart } from "../hooks/useChart";

function CandlestickChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChart(containerRef);
  return <div ref={containerRef} />;
}

export default CandlestickChart;
