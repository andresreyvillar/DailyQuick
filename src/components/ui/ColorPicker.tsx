import { useState } from "react";

import { ACCENTS } from "../../lib/accent-palette";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  /** Accessible name for the trigger swatch (e.g. `Color de Oakmond`). */
  label: string;
};

/** A color control: a swatch button that opens a palette of the project accents + a custom-color option. */
export function ColorPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);

  function pick(hex: string) {
    onChange(hex);
    setOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded-full border border-black/10"
        style={{ backgroundColor: value }}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute left-0 top-[22px] z-50 w-[180px] rounded-[10px] border border-line bg-surface p-2 shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
            <div className="grid grid-cols-6 gap-1.5">
              {ACCENTS.map((accent) => (
                <button
                  key={accent.hex}
                  type="button"
                  aria-label={accent.name}
                  title={accent.name}
                  onClick={() => pick(accent.hex)}
                  className={`h-5 w-5 rounded-full ${
                    value.toLowerCase() === accent.hex.toLowerCase()
                      ? "ring-2 ring-ink ring-offset-1"
                      : "border border-black/10"
                  }`}
                  style={{ backgroundColor: accent.hex }}
                />
              ))}
            </div>
            <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-[12.5px] text-body hover:bg-hover">
              <input
                type="color"
                aria-label="Color personalizado"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
              />
              Personalizado
            </label>
          </div>
        </>
      )}
    </div>
  );
}
