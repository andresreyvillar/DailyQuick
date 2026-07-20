/** How long a frame must be held outside the board before releasing it triggers a delete. */
export const HOLD_TO_DELETE_MS = 1000;

/** Immutable move of `items[from]` to index `to`. No-op (returns the same array) for equal/invalid indices. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** A drop deletes only when it lands outside the board and was held long enough (the safety gate). */
export function shouldDeleteOnDrop(insideBoard: boolean, heldMs: number): boolean {
  return !insideBoard && heldMs >= HOLD_TO_DELETE_MS;
}
