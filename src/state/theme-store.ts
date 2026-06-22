import { create } from "zustand";

export type Theme = "nitido" | "bujo" | "citrus";

const THEME_KEY = "dailyquick:theme";
const THEMES: Theme[] = ["nitido", "bujo", "citrus"];

/** Read the persisted theme, defaulting to "nitido" when nothing valid is stored. */
export function loadTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return THEMES.includes(stored as Theme) ? (stored as Theme) : "nitido";
}

/** Reflect the theme on the document root so the `html[data-theme]` variable sets take effect. */
function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/** Apply the persisted theme once at startup (call from the app shell before/at first render). */
export function initTheme(): void {
  applyTheme(loadTheme());
}

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: loadTheme(),
  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },
}));
