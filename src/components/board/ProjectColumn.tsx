import { useState } from "react";

import { useBoardStore } from "../../state/board-store";
import { useDebouncedSave } from "../../features/day/useDebouncedSave";
import { MarkdownEditor } from "../editor/MarkdownEditor";

/** A single project's pane: accent-tinted header (editable title + color dot) + the Markdown editor. */
export function ProjectColumn({ slug }: { slug: string }) {
  const project = useBoardStore((s) => s.projects.find((p) => p.slug === slug));
  const dayKey = useBoardStore((s) => s.dayKey);
  const revision = useBoardStore((s) => s.revisions[slug] ?? 0);
  const setBody = useBoardStore((s) => s.setBody);
  const persistBody = useBoardStore((s) => s.persistBody);
  const setColor = useBoardStore((s) => s.setColor);
  const rename = useBoardStore((s) => s.rename);
  const { onChange } = useDebouncedSave(() => persistBody(slug));

  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  if (!project) return null;

  const title = project.frontmatter.title;
  const accent = project.frontmatter.color ?? "#9AA0A9";

  function commitTitle() {
    setEditingTitle(false);
    const next = draftTitle.trim();
    if (next && next !== title) void rename(slug, next);
  }

  return (
    // No overflow on the section/body: keeps the editor's slash menu from being clipped
    // (rounded corners are done per-corner instead). Restoring per-column scroll is follow-up F.2.
    <section className="flex h-full flex-col rounded-[10px] border border-line bg-surface shadow-[0_1px_2px_rgba(20,24,33,0.04)]">
      <header
        className="flex items-center gap-2 rounded-t-[10px] px-3.5 py-[11px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${accent} 8%, white)`,
          borderBottom: `1px solid color-mix(in srgb, ${accent} 22%, white)`,
        }}
        data-accent-color={accent}
      >
        <input
          type="color"
          aria-label={`Color de ${title}`}
          value={project.frontmatter.color ?? "#9AA0A9"}
          onChange={(e) => void setColor(slug, e.target.value)}
          className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0"
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
            className="flex-1 bg-transparent text-[14.5px] font-semibold text-strong outline-none"
          />
        ) : (
          <h2
            className="flex-1 cursor-text truncate text-[14.5px] font-semibold text-strong"
            onDoubleClick={() => {
              setDraftTitle(title);
              setEditingTitle(true);
            }}
          >
            {title}
          </h2>
        )}
      </header>
      <div className="flex-1 rounded-b-[10px] bg-surface">
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
