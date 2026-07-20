import { create } from "zustand";

import {
  createProject as apiCreateProject,
  deleteNote as apiDeleteNote,
  listDay,
  readNote,
  writeNote,
  type CalendarEvent,
  type ForecastProject,
  type Frontmatter,
} from "../lib/notes-api";
import { addDays, todayKey } from "../lib/date-key";
import { eventBlock, eventProjectBody } from "../lib/event-markdown";
import { nextAccent } from "../lib/accent-palette";

export type Orientation = "vertical" | "horizontal";

const ORIENTATION_KEY = "dailyquick:orientation";

/** Read the persisted split orientation, defaulting to vertical (side-by-side columns). */
export function loadOrientation(): Orientation {
  const stored = localStorage.getItem(ORIENTATION_KEY);
  return stored === "horizontal" ? "horizontal" : "vertical";
}

const CONTEXT_COLLAPSED_KEY = "dailyquick:context-collapsed";

/** Read the persisted collapsed state of the day-context region, defaulting to expanded. */
export function loadContextCollapsed(): boolean {
  return localStorage.getItem(CONTEXT_COLLAPSED_KEY) === "true";
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
  /** Whether the day-context region (calendar + forecast) is collapsed. */
  contextCollapsed: boolean;
  loadDay: (key: string) => Promise<void>;
  setOrientation: (orientation: Orientation) => void;
  toggleOrientation: () => void;
  setContextCollapsed: (collapsed: boolean) => void;
  toggleContext: () => void;
  setBody: (slug: string, body: string) => void;
  persistBody: (slug: string) => Promise<void>;
  createProject: (title: string, color: string) => Promise<void>;
  deleteProject: (slug: string) => Promise<void>;
  /** Recreate the previous day's projects (title + color, empty body) for the current day. */
  importPreviousDay: () => Promise<void>;
  setColor: (slug: string, color: string) => Promise<void>;
  rename: (slug: string, title: string) => Promise<void>;
  goToDay: (key: string) => Promise<void>;
  goToPreviousDay: () => Promise<void>;
  goToNextDay: () => Promise<void>;
  goToToday: () => Promise<void>;
  /** Per-project counter bumped on external writes, to force the editor to remount + reload. */
  revisions: Record<string, number>;
  createProjectFromEvent: (event: CalendarEvent) => Promise<void>;
  /** Create a project column for a forecasted project (unused accent, empty body). */
  createProjectFromForecast: (project: ForecastProject) => Promise<void>;
  addEventToProject: (slug: string, event: CalendarEvent) => Promise<void>;
  /** Seed an (empty) project note with template Markdown; reloads the editor via the revision bump. */
  applyTemplate: (slug: string, markdown: string) => Promise<void>;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  dayKey: null,
  projects: [],
  orientation: loadOrientation(),
  contextCollapsed: loadContextCollapsed(),
  revisions: {},

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

  setContextCollapsed(contextCollapsed) {
    localStorage.setItem(CONTEXT_COLLAPSED_KEY, String(contextCollapsed));
    set({ contextCollapsed });
  },

  toggleContext() {
    get().setContextCollapsed(!get().contextCollapsed);
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

  async createProject(title, color) {
    const { dayKey } = get();
    if (!dayKey) return;
    await apiCreateProject(dayKey, title, color);
    await get().loadDay(dayKey);
  },

  async importPreviousDay() {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const previous = await listDay(addDays(dayKey, -1));
    const existing = new Set(projects.map((p) => p.slug));
    // Accumulate colors as we go so a colorless source project falls back to an accent not yet used.
    const used = projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
    for (const summary of previous) {
      if (existing.has(summary.slug)) continue;
      const color = summary.color ?? nextAccent(used);
      try {
        await apiCreateProject(dayKey, summary.title, color);
        used.push(color);
      } catch {
        // Skip duplicates / invalid titles — carry-over never overwrites an existing note.
      }
    }
    await get().loadDay(dayKey);
  },

  async deleteProject(slug) {
    const { dayKey } = get();
    if (!dayKey) return;
    await apiDeleteNote(dayKey, slug);
    const revisions = { ...get().revisions };
    delete revisions[slug];
    set({ projects: get().projects.filter((p) => p.slug !== slug), revisions });
  },

  async setColor(slug, color) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    const frontmatter = { ...project.frontmatter, color };
    await writeNote(dayKey, slug, { frontmatter, body: project.body });
    set({ projects: projects.map((p) => (p.slug === slug ? { ...p, frontmatter } : p)) });
  },

  async rename(slug, title) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    const frontmatter = { ...project.frontmatter, title };
    await writeNote(dayKey, slug, { frontmatter, body: project.body });
    set({ projects: projects.map((p) => (p.slug === slug ? { ...p, frontmatter } : p)) });
  },

  async goToDay(key) {
    await get().loadDay(key);
  },

  async goToPreviousDay() {
    const { dayKey } = get();
    if (!dayKey) return;
    await get().loadDay(addDays(dayKey, -1));
  },

  async goToNextDay() {
    const { dayKey } = get();
    if (!dayKey) return;
    await get().loadDay(addDays(dayKey, 1));
  },

  async goToToday() {
    await get().loadDay(todayKey());
  },

  async createProjectFromEvent(event) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const used = projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
    const summary = await apiCreateProject(dayKey, event.title, nextAccent(used));
    await writeNote(dayKey, summary.slug, {
      frontmatter: {
        title: summary.title,
        color: summary.color,
        order: summary.order,
        created: dayKey,
      },
      body: eventProjectBody(event),
    });
    await get().loadDay(dayKey);
  },

  async createProjectFromForecast(project) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const used = projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
    await apiCreateProject(dayKey, project.name, nextAccent(used));
    await get().loadDay(dayKey);
  },

  async addEventToProject(slug, event) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    const body = project.body ? `${project.body}\n\n${eventBlock(event)}` : eventBlock(event);
    await writeNote(dayKey, slug, { frontmatter: project.frontmatter, body });
    set({
      projects: get().projects.map((p) => (p.slug === slug ? { ...p, body } : p)),
      revisions: { ...get().revisions, [slug]: (get().revisions[slug] ?? 0) + 1 },
    });
  },

  async applyTemplate(slug, markdown) {
    const { dayKey, projects } = get();
    if (!dayKey) return;
    const project = projects.find((p) => p.slug === slug);
    if (!project) return;
    await writeNote(dayKey, slug, { frontmatter: project.frontmatter, body: markdown });
    set({
      projects: get().projects.map((p) => (p.slug === slug ? { ...p, body: markdown } : p)),
      revisions: { ...get().revisions, [slug]: (get().revisions[slug] ?? 0) + 1 },
    });
  },
}));
