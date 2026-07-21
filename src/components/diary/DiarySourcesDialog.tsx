import { useEffect, useState } from "react";

import { readDiarySource, setDiarySource } from "../../lib/notes-api";

type Props = { slug: string; title: string; onClose: () => void };

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Modal to link a project to the diary: the terms searched in Apple Mail + Slack to build it. Defaults
 * to the project title (editable — add aliases with commas). Consumed by the /project-diary producer.
 */
export function DiarySourcesDialog({ slug, title, onClose }: Props) {
  const [terms, setTerms] = useState(title);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    readDiarySource(slug)
      .then((source) => {
        // Pre-fill with saved terms, or the project title on first setup.
        if (active && source.searchTerms.length > 0) setTerms(source.searchTerms.join(", "));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [slug]);

  async function save() {
    setSaving(true);
    try {
      await setDiarySource(slug, { searchTerms: parseList(terms) });
      onClose();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-[360px] rounded-[12px] border border-line bg-surface p-4 shadow-[0_12px_40px_rgba(20,24,33,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 text-[13px] font-semibold text-strong">Vincular fuentes · {title}</p>
        <p className="mb-3 text-[11.5px] text-faint">
          El diario buscará estos términos en tu correo (Apple Mail) y en Slack.
        </p>

        <label className="mb-3.5 block">
          <span className="mb-1 block text-[11.5px] text-muted">Términos de búsqueda (separa con comas)</span>
          <input
            aria-label="Términos de búsqueda"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder={title}
            className="h-[30px] w-full rounded-lg border border-line-field bg-field px-2.5 text-[13px] text-strong placeholder:text-faint focus:border-line focus:bg-surface focus:outline-none"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-[12.5px] font-medium text-body hover:bg-hover"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-md bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
