import { createStore } from "satcheljs";
import { readSettings, writeSettings } from "./settings.utils";

const saved = readSettings();

export type Theme = "light" | "dark";

interface SettingsStore {
  favorites: string[];
  language: string;
  theme: Theme;
  avatarUrl: string | null;
}

function resolveInitialTheme(): Theme {
  if (saved.theme === "light" || saved.theme === "dark") return saved.theme;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

const initialTheme = resolveInitialTheme();
document.documentElement.classList.toggle("dark", initialTheme === "dark");
if (!saved.theme) {
  writeSettings({ theme: initialTheme });
}

const settingsStore = createStore<SettingsStore>("settingsStore", {
  favorites: saved.favorites ?? [],
  language: saved.language ?? "en",
  theme: initialTheme,
  avatarUrl: saved.avatarUrl ?? null,
});

export default settingsStore;
