import { useBoardStore } from "../../state/board-store";
import { useDebouncedSave } from "../../features/day/useDebouncedSave";

/** A single project's pane: title + color accent + inline (placeholder) editor. */
export function ProjectColumn({ slug }: { slug: string }) {
  const project = useBoardStore((s) => s.projects.find((p) => p.slug === slug));
  const setBody = useBoardStore((s) => s.setBody);
  const persistBody = useBoardStore((s) => s.persistBody);
  const { onChange, flush } = useDebouncedSave(() => persistBody(slug));

  if (!project) return null;

  const accent = project.frontmatter.color ?? "transparent";

  return (
    <section className="flex h-full flex-col">
      <header
        className="border-l-4 px-3 py-2"
        style={{ borderColor: accent }}
        data-accent-color={accent}
      >
        <h2 className="font-semibold">{project.frontmatter.title}</h2>
      </header>
      <textarea
        aria-label={`Notas de ${project.frontmatter.title}`}
        value={project.body}
        onChange={(e) => {
          setBody(slug, e.target.value);
          onChange();
        }}
        onBlur={flush}
        className="flex-1 resize-none bg-transparent p-3 font-mono text-sm outline-none"
        placeholder="Escribe en Markdown…"
      />
    </section>
  );
}
