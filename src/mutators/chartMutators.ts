import { mutator } from "satcheljs";
import { candlesLoaded, chartFailed, chartLoading } from "../actions/chartActions";
import chartStore from "../store/chartStore";

mutator(chartLoading, ({ symbol, interval }) => {
  chartStore().symbol = symbol;
  chartStore().interval = interval;
  chartStore().isLoading = true;
  chartStore().error = null;
  chartStore().candles = [];
});

mutator(candlesLoaded, ({ candles }) => {
  chartStore().candles = candles;
  chartStore().isLoading = false;
});

mutator(chartFailed, ({ error }) => {
  chartStore().error = error;
  chartStore().isLoading = false;
});
