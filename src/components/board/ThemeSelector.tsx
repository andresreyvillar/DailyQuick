import { useState } from "react";

import { useThemeStore, type Theme } from "../../state/theme-store";

const THEME_OPTIONS: { key: Theme; name: string; swatch: string }[] = [
  { key: "nitido", name: "Nítido", swatch: "linear-gradient(135deg,#ffffff 50%,#eef3fc 50%)" },
  { key: "bujo", name: "Bullet Journal", swatch: "repeating-linear-gradient(45deg,#cf6470 0 4px,#e8a0a8 4px 8px)" },
  { key: "citrus", name: "Cítrico", swatch: "linear-gradient(135deg,#4f7fd6,#2f9aa8,#3a9d6b,#c08a2e,#cf6470)" },
];

/** Header control: a swatch button that opens a popover to pick one of the predefined themes. */
export function ThemeSelector() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);

  const current = THEME_OPTIONS.find((t) => t.key === theme) ?? THEME_OPTIONS[0];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Cambiar tema"
        onClick={() => setOpen((value) => !value)}
        className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-line-field bg-field hover:bg-hover"
      >
        <span
          className="h-[18px] w-[18px] rounded-md border border-black/10"
          style={{ background: current.swatch }}
          aria-hidden="true"
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-[36px] z-50 w-[208px] rounded-[10px] border border-line bg-surface p-1 shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
            <div className="px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
              Tema
            </div>
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setTheme(opt.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-hover ${
                  opt.key === theme ? "bg-hover" : ""
                }`}
              >
                <span
                  className="h-[22px] w-[22px] rounded-md border border-black/10"
                  style={{ background: opt.swatch }}
                  aria-hidden="true"
                />
                <span className="text-[13px] font-semibold text-strong">{opt.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
