import { useState } from "react";

import { useBoardStore } from "../../state/board-store";
import { useThemeStore } from "../../state/theme-store";
import { useDebouncedSave } from "../../features/day/useDebouncedSave";
import { MarkdownEditor } from "../editor/MarkdownEditor";
import { ColorPicker } from "../ui/ColorPicker";

/** A single project's pane: accent-tinted header (editable title + color dot) + the Markdown editor. */
export function ProjectColumn({ slug }: { slug: string }) {
  const project = useBoardStore((s) => s.projects.find((p) => p.slug === slug));
  const dayKey = useBoardStore((s) => s.dayKey);
  const revision = useBoardStore((s) => s.revisions[slug] ?? 0);
  const setBody = useBoardStore((s) => s.setBody);
  const persistBody = useBoardStore((s) => s.persistBody);
  const setColor = useBoardStore((s) => s.setColor);
  const rename = useBoardStore((s) => s.rename);
  const deleteProject = useBoardStore((s) => s.deleteProject);
  const theme = useThemeStore((s) => s.theme);
  const { onChange } = useDebouncedSave(() => persistBody(slug));

  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!project) return null;

  const title = project.frontmatter.title;
  const accent = project.frontmatter.color ?? "#9AA0A9";

  function commitTitle() {
    setEditingTitle(false);
    const next = draftTitle.trim();
    if (next && next !== title) void rename(slug, next);
  }

  function closeMenu() {
    setMenuOpen(false);
    setConfirming(false);
  }

  return (
    // No overflow on the section/body: keeps the editor's slash menu from being clipped
    // (rounded corners are done per-corner instead). Restoring per-column scroll is follow-up F.2.
    <section className="col-card flex h-full flex-col border border-line bg-surface">
      <header
        className="col-band relative flex items-center gap-2 rounded-t-[var(--radius-col)] px-3.5 py-[11px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${accent} 8%, white)`,
          borderBottomColor: `color-mix(in srgb, ${accent} 22%, white)`,
        }}
        data-accent-color={accent}
      >
        <ColorPicker
          value={project.frontmatter.color ?? "#9AA0A9"}
          onChange={(hex) => void setColor(slug, hex)}
          label={`Color de ${title}`}
        />
        {editingTitle ? (
          <input
            aria-label={`Renombrar ${title}`}
            value={draftTitle}
            autoFocus
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            className="col-title flex-1 bg-transparent font-semibold text-strong outline-none"
          />
        ) : (
          <h2
            className="col-title flex-1 cursor-text truncate font-semibold text-strong"
            onDoubleClick={() => {
              setDraftTitle(title);
              setEditingTitle(true);
            }}
          >
            {title}
          </h2>
        )}
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={`Acciones de ${title}`}
            onClick={() => {
              setConfirming(false);
              setMenuOpen((open) => !open);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[16px] leading-none text-muted hover:bg-black/5"
          >
            ⋯
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={closeMenu} aria-hidden="true" />
              <div className="absolute right-0 top-[30px] z-50 w-[224px] rounded-[10px] border border-line bg-surface p-1 text-left shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
                {!confirming ? (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] font-medium text-[#E5484D] hover:bg-[#FDF0F0]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                    Eliminar proyecto
                  </button>
                ) : (
                  <div className="px-2 py-1.5">
                    <p className="mb-2 text-[12.5px] text-body">
                      ¿Eliminar “{title}”? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={closeMenu}
                        className="rounded-md px-2.5 py-1 text-[12.5px] font-medium text-body hover:bg-hover"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          closeMenu();
                          void deleteProject(slug);
                        }}
                        className="rounded-md bg-[#E5484D] px-2.5 py-1 text-[12.5px] font-semibold text-white hover:bg-[#D33A3F]"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {theme === "bujo" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-12 top-1 h-[17px] w-[50px] -rotate-6 rounded-[1px]"
            style={{
              background: `repeating-linear-gradient(45deg, ${accent} 0 6px, color-mix(in srgb, ${accent} 55%, white) 6px 12px)`,
              opacity: 0.5,
              boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
              animation: "floatY 4s ease-in-out infinite",
            }}
          />
        )}
      </header>
      <div className="flex-1 rounded-b-[var(--radius-col)] bg-surface">
        <MarkdownEditor
          key={`${dayKey}:${slug}:${revision}`}
          value={project.body}
          onChange={(markdown) => {
            setBody(slug, markdown);
            onChange();
          }}
        />
      </div>
    </section>
  );
}
