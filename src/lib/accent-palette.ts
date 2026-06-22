/** The six project accent colors (same lightness/chroma, varying hue) from the design handoff. */
export type Accent = { name: string; hex: string };

export const ACCENTS: Accent[] = [
  { name: "Azul", hex: "#4F7FD6" },
  { name: "Teal", hex: "#2F9AA8" },
  { name: "Verde", hex: "#3A9D6B" },
  { name: "Ámbar", hex: "#C08A2E" },
  { name: "Rosa", hex: "#CF6470" },
  { name: "Violeta", hex: "#8A76D4" },
];

/** Map an arbitrary key (e.g. a calendar id) to a stable accent hex from the palette. */
export function accentForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length].hex;
}
