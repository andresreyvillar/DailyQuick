import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedSave } from "./useDebouncedSave";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedSave", () => {
  it("saves once after the debounce delay", () => {
    const save = vi.fn();
    const { result } = renderHook(() => useDebouncedSave(save, 500));

    act(() => result.current.onChange());
    expect(save).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("flush saves a pending change immediately and only once", () => {
    const save = vi.fn();
    const { result } = renderHook(() => useDebouncedSave(save, 500));

    act(() => result.current.onChange());
    act(() => result.current.flush());
    expect(save).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it("flushes a pending change on unmount", () => {
    const save = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedSave(save, 500));

    act(() => result.current.onChange());
    unmount();

    expect(save).toHaveBeenCalledTimes(1);
  });
});
