import { create } from "zustand";

const KEY = "dailyquick:hidden-calendars";

function load(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

type CalendarState = {
  /** Calendar ids the user has hidden. Empty = all visible (the default). */
  hidden: string[];
  toggle: (id: string) => void;
};

export const useCalendarStore = create<CalendarState>((set, get) => ({
  hidden: load(),
  toggle: (id) => {
    const current = get().hidden;
    const hidden = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(hidden));
    set({ hidden });
  },
}));
