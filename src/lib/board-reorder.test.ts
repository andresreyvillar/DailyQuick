import { describe, expect, it } from "vitest";

import { HOLD_TO_DELETE_MS, moveItem, shouldDeleteOnDrop } from "./board-reorder";

describe("moveItem", () => {
  it("moves an item to a new index", () => {
    expect(moveItem(["A", "B", "C"], 2, 0)).toEqual(["C", "A", "B"]);
    expect(moveItem(["A", "B", "C"], 0, 2)).toEqual(["B", "C", "A"]);
  });

  it("is a no-op (same array) for equal or out-of-range indices", () => {
    const items = ["A", "B"];
    expect(moveItem(items, 1, 1)).toBe(items);
    expect(moveItem(items, -1, 0)).toBe(items);
    expect(moveItem(items, 0, 5)).toBe(items);
  });
});

describe("shouldDeleteOnDrop", () => {
  it("deletes only when released outside the board after the hold", () => {
    expect(shouldDeleteOnDrop(false, HOLD_TO_DELETE_MS)).toBe(true);
    expect(shouldDeleteOnDrop(false, HOLD_TO_DELETE_MS + 500)).toBe(true);
  });

  it("does not delete inside the board or before the hold", () => {
    expect(shouldDeleteOnDrop(true, HOLD_TO_DELETE_MS + 500)).toBe(false);
    expect(shouldDeleteOnDrop(false, HOLD_TO_DELETE_MS - 1)).toBe(false);
  });
});
