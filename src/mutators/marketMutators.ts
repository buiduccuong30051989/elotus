import { mutator } from "satcheljs";
import { pairsFailed, pairsLoaded, pairsLoading } from "../actions/marketActions";
import marketStore from "../store/marketStore";

mutator(pairsLoading, () => {
  marketStore().isLoading = true;
  marketStore().error = null;
});

mutator(pairsLoaded, ({ pairs }) => {
  marketStore().pairs = pairs;
  marketStore().isLoading = false;
});

mutator(pairsFailed, ({ error }) => {
  marketStore().error = error;
  marketStore().isLoading = false;
});
