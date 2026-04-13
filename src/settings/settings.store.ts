import { createStore } from "satcheljs";

const saved = JSON.parse(localStorage.getItem("settings") ?? "{}");

interface SettingsStore {
  favorites: string[];
  language: string;
  theme: "light" | "dark" | "system";
  avatarUrl: string | null;
}

const settingsStore = createStore<SettingsStore>("settingsStore", {
  favorites: saved.favorites ?? [],
  language: saved.language ?? "en",
  theme: saved.theme ?? "system",
  avatarUrl: saved.avatarUrl ?? null,
});

export function readSettings() {
  return JSON.parse(localStorage.getItem("settings") ?? "{}");
}

export function writeSettings(patch: object) {
  localStorage.setItem("settings", JSON.stringify({ ...readSettings(), ...patch }));
}

export default settingsStore;
