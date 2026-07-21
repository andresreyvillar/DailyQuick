import { useEffect, useState } from "react";

import { syncDiary } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

/** Permanent header button that triggers a diary sync (runs the Claude Code producer) and reloads panels. */
export function SyncDiaryButton() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const refreshDiary = useBoardStore((s) => s.refreshDiary);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  async function run() {
    if (!dayKey || syncing) return;
    setSyncing(true);
    try {
      await syncDiary(dayKey);
      refreshDiary();
      setToast("Diario sincronizado");
    } catch {
      setToast("No se pudo sincronizar el diario");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Sincronizar diario"
        disabled={syncing}
        onClick={() => void run()}
        className="flex h-[30px] items-center gap-1.5 rounded-lg border border-line px-2.5 text-[13px] font-semibold text-body hover:bg-hover disabled:opacity-60"
      >
        <svg
          width="14"
          height="14"
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
        {syncing ? "Sincronizando…" : "Sincronizar"}
      </button>

      {toast && (
        <div
          role="status"
          className="fixed bottom-[18px] left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-[9px] bg-ink px-3.5 py-2.5 text-[12.5px] font-medium text-white shadow-[0_8px_24px_rgba(20,24,33,0.28)]"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-[#5CC08A]" aria-hidden="true" />
          {toast}
        </div>
      )}
    </>
  );
}
