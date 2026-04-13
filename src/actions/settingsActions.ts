import { action } from "satcheljs";

export const toggleFavorite = action("toggleFavorite", (symbol: string) => ({ symbol }));
export const setLanguage = action("setLanguage", (language: string) => ({ language }));
export const setTheme = action("setTheme", (theme: "light" | "dark") => ({ theme }));
export const setAvatarUrl = action("setAvatarUrl", (avatarUrl: string | null) => ({ avatarUrl }));
