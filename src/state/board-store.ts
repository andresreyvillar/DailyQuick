import { create } from "zustand";

import {
  listDay,
  readNote,
  writeNote,
  type Frontmatter,
} from "../lib/notes-api";

export type Orientation = "vertical" | "horizontal";

const ORIENTATION_KEY = "dailyquick:orientation";

/** Read the persisted split orientation, defaulting to vertical (side-by-side columns). */
export function loadOrientation(): Orientation {
  const stored = localStorage.getItem(ORIENTATION_KEY);
  return stored === "horizontal" ? "horizontal" : "vertical";
}

export type ProjectState = {
  slug: string;
  frontmatter: Frontmatter;
  body: string;
};

type BoardState = {
  dayKey: string | null;
  projects: ProjectState[];
  orientation: Orientation;
  loadDay: (key: string) => Promise<void>;
  setOrientation: (orientation: Orientation) => void;
  toggleOrientation: () => void;
  setBody: (slug: string, body: string) => void;
  persistBody: (slug: string) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  dayKey: null,
  projects: [],
  orientation: loadOrientation(),

  async loadDay(key) {
    const summaries = await listDay(key);
    const projects = await Promise.all(
      summaries.map(async (summary) => {
        const note = await readNote(key, summary.slug);
        return { slug: summary.slug, frontmatter: note.frontmatter, body: note.body };
      }),
    );
    set({ dayKey: key, projects });
  },

  setOrientation(orientation) {
    localStorage.setItem(ORIENTATION_KEY, orientation);
    set({ orientation });
  },

  toggleOrientation() {
    get().setOrientation(get().orientation === "vertical" ? "horizontal" : "vertical");
  },

  setBody(slug, body) {
    set({
      projects: get().projects.map((p) => (p.slug === slug ? { ...p, body } : p)),
    });
  },

  async persistBody(slug) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    // Preserve the full frontmatter; only the body changed.
    await writeNote(dayKey, slug, { frontmatter: project.frontmatter, body: project.body });
  },
}));
