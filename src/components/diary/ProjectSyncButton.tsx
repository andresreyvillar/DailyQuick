import { useEffect, useState } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

import { todayKey } from "../../lib/date-key";
import { syncProjectDiary } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

type Progress = { slug: string; message: string };
type Done = { slug: string; ok: boolean };

/** Per-project diary sync: starts a non-blocking sync of TODAY for this project and streams live progress. */
export function ProjectSyncButton({ slug }: { slug: string }) {
  const refreshDiary = useBoardStore((s) => s.refreshDiary);
  const [syncing, setSyncing] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const unlisteners: UnlistenFn[] = [];
    listen<Progress>("diary-sync-progress", (e) => {
      if (e.payload.slug === slug) setLog((prev) => [...prev, e.payload.message]);
    })
      .then((u) => unlisteners.push(u))
      .catch(() => {});
    listen<Done>("diary-sync-done", (e) => {
      if (e.payload.slug !== slug) return;
      setSyncing(false);
      setLog((prev) => [...prev, e.payload.ok ? "✓ Sincronizado" : "✗ La sincronización falló"]);
      if (e.payload.ok) refreshDiary();
    })
      .then((u) => unlisteners.push(u))
      .catch(() => {});
    return () => unlisteners.forEach((u) => u());
  }, [slug, refreshDiary]);

  async function start() {
    if (syncing) return;
    setSyncing(true);
    setLog([]);
    try {
      await syncProjectDiary(todayKey(), slug);
    } catch {
      setSyncing(false);
      setLog(["No se pudo iniciar la sincronización (¿está «claude» disponible?)"]);
    }
  }

  return (
    <div className="px-4 pt-3">
      <button
        type="button"
        aria-label="Sincronizar diario"
        disabled={syncing}
        onClick={() => void start()}
        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[12px] font-semibold text-body hover:bg-hover disabled:opacity-60"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={syncing ? "animate-spin" : ""}
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
        {syncing ? "Sincronizando…" : "Sincronizar diario"}
      </button>

      {log.length > 0 && (
        <div className="mt-2 max-h-28 overflow-auto rounded-[8px] border border-line bg-subtle p-2 text-[11px] leading-snug text-muted">
          {log.map((message, index) => (
            <div key={index} className="truncate">
              {message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
