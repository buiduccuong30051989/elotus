import { action } from "satcheljs";
import type { Theme } from "./settings.store";

export const toggleFavorite = action("toggleFavorite", (symbol: string) => ({ symbol }));
export const setLanguage = action("setLanguage", (language: string) => ({ language }));
export const setTheme = action("setTheme", (theme: Theme) => ({ theme }));
export const setAvatarUrl = action("setAvatarUrl", (avatarUrl: string | null) => ({ avatarUrl }));
