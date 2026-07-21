import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";

import { accessStatus, testMailAccess, type AccessStatus } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

const SLACK_LABEL: Record<string, string> = {
  connected: "Conectado",
  "needs-auth": "Requiere autenticación",
  "not-configured": "No configurado",
  unknown: "Desconocido",
};

const rowClass = "mb-2.5 rounded-[10px] border border-line px-3 py-2.5";

/** Access-settings panel (opened from the native "DailyQuick → Ajustes…" menu). Shows the status of the
 *  Claude CLI / Slack MCP and lets the user test/grant Apple Mail access. The app holds no credentials. */
export function SettingsPanel() {
  const open = useBoardStore((s) => s.settingsOpen);
  const setOpen = useBoardStore((s) => s.setSettingsOpen);
  const [status, setStatus] = useState<AccessStatus | null>(null);
  const [mail, setMail] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    listen("open-settings", () => setOpen(true))
      .then((u) => {
        unlisten = u;
      })
      .catch(() => {});
    return () => unlisten?.();
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    setMail(null);
    accessStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [open]);

  if (!open) return null;

  async function testMail() {
    setTesting(true);
    try {
      setMail({ ok: true, text: await testMailAccess() });
    } catch (e) {
      setMail({ ok: false, text: e instanceof Error ? e.message : "Acceso denegado" });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[420px] rounded-[12px] border border-line bg-surface p-4 shadow-[0_12px_40px_rgba(20,24,33,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-1 text-[13px] font-semibold text-strong">Ajustes · Accesos</p>
        <p className="mb-3 text-[11.5px] text-faint">
          El diario usa estos accesos a través de Claude Code. La app no guarda credenciales.
        </p>

        <div className={rowClass}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-strong">Apple Mail</span>
            <button
              type="button"
              disabled={testing}
              onClick={() => void testMail()}
              className="rounded-md border border-line px-2.5 py-1 text-[12px] font-medium text-body hover:bg-hover disabled:opacity-60"
            >
              {testing ? "Probando…" : "Probar acceso"}
            </button>
          </div>
          <p className={`mt-1 text-[11.5px] ${mail ? (mail.ok ? "text-[#3A9D6B]" : "text-[#CF6470]") : "text-faint"}`}>
            {mail ? mail.text : "Concede el permiso de Automatización de macOS al probar."}
          </p>
        </div>

        <div className={rowClass}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-strong">Claude Code (CLI)</span>
            <span className={`text-[11.5px] ${status?.claude ? "text-[#3A9D6B]" : "text-[#CF6470]"}`}>
              {status?.claude ?? "No encontrado"}
            </span>
          </div>
        </div>

        <div className="mb-3.5 rounded-[10px] border border-line px-3 py-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-medium text-strong">Slack (MCP)</span>
            <span className="text-[11.5px] text-muted">{status ? (SLACK_LABEL[status.slack] ?? status.slack) : "…"}</span>
          </div>
          <p className="mt-1 text-[11.5px] text-faint">
            Si requiere autenticación, ejecuta <code>/mcp</code> en Claude Code (OAuth por navegador). La app no puede completarlo.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md bg-ink px-3 py-1.5 text-[12.5px] font-semibold text-white hover:opacity-90"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
