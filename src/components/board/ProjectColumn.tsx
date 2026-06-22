import { useState } from "react";

import { useBoardStore } from "../../state/board-store";
import { useDebouncedSave } from "../../features/day/useDebouncedSave";
import { MarkdownEditor } from "../editor/MarkdownEditor";

/** A single project's pane: title + color accent (both editable) + inline placeholder editor. */
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
  const accent = project.frontmatter.color ?? "transparent";

  function commitTitle() {
    setEditingTitle(false);
    const next = draftTitle.trim();
    if (next && next !== title) void rename(slug, next);
  }

  return (
    <section className="flex h-full flex-col">
      <header
        className="flex items-center gap-2 border-l-4 px-3 py-2"
        style={{ borderColor: accent }}
        data-accent-color={accent}
      >
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
            className="font-semibold outline-none"
          />
        ) : (
          <h2
            className="cursor-text font-semibold"
            onDoubleClick={() => {
              setDraftTitle(title);
              setEditingTitle(true);
            }}
          >
            {title}
          </h2>
        )}
        <input
          type="color"
          aria-label={`Color de ${title}`}
          value={project.frontmatter.color ?? "#000000"}
          onChange={(e) => void setColor(slug, e.target.value)}
          className="ml-auto h-5 w-6 cursor-pointer border-0 bg-transparent p-0"
        />
      </header>
      <div className="flex-1">
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
