import { mutator } from "satcheljs";
import { setAvatarUrl, setLanguage, setTheme, toggleFavorite } from "./settings.actions";
import settingsStore, { writeSettings } from "./settings.store";

mutator(toggleFavorite, ({ symbol }) => {
  const favs = settingsStore().favorites;
  const idx = favs.indexOf(symbol);
  if (idx === -1) {
    favs.push(symbol);
  } else {
    favs.splice(idx, 1);
  }
  writeSettings({ favorites: favs.slice() });
});

mutator(setLanguage, ({ language }) => {
  settingsStore().language = language;
  writeSettings({ language });
});

mutator(setTheme, ({ theme }) => {
  settingsStore().theme = theme;
  writeSettings({ theme });
});

mutator(setAvatarUrl, ({ avatarUrl }) => {
  settingsStore().avatarUrl = avatarUrl;
  writeSettings({ avatarUrl });
});
