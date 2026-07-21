import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { handlers } = vi.hoisted(() => ({ handlers: {} as Record<string, (e: unknown) => void> }));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn((name: string, cb: (e: unknown) => void) => {
    handlers[name] = cb;
    return Promise.resolve(() => {});
  }),
}));
vi.mock("../../lib/notes-api", () => ({ syncProjectDiary: vi.fn() }));

import { syncProjectDiary } from "../../lib/notes-api";
import { todayKey } from "../../lib/date-key";
import { useBoardStore } from "../../state/board-store";
import { ProjectSyncButton } from "./ProjectSyncButton";

const mockSync = vi.mocked(syncProjectDiary);

beforeEach(() => {
  vi.clearAllMocks();
  for (const k of Object.keys(handlers)) delete handlers[k];
  useBoardStore.setState({ diaryNonce: 0 });
  mockSync.mockResolvedValue(undefined);
});

describe("ProjectSyncButton", () => {
  it("starts a sync for today and streams progress for this project", async () => {
    render(<ProjectSyncButton slug="duin" />);
    await waitFor(() => expect(typeof handlers["diary-sync-progress"]).toBe("function"));

    fireEvent.click(screen.getByRole("button", { name: "Sincronizar diario" }));
    await waitFor(() => expect(mockSync).toHaveBeenCalledWith(todayKey(), "duin"));

    act(() => handlers["diary-sync-progress"]({ payload: { slug: "duin", message: "→ Slack" } }));
    expect(screen.getByText("→ Slack")).toBeInTheDocument();

    // An event for another project is ignored.
    act(() => handlers["diary-sync-progress"]({ payload: { slug: "otro", message: "→ Mail" } }));
    expect(screen.queryByText("→ Mail")).not.toBeInTheDocument();
  });

  it("refreshes the diary when its sync completes successfully", async () => {
    render(<ProjectSyncButton slug="duin" />);
    await waitFor(() => expect(typeof handlers["diary-sync-done"]).toBe("function"));

    const before = useBoardStore.getState().diaryNonce;
    act(() => handlers["diary-sync-done"]({ payload: { slug: "duin", ok: true } }));

    expect(useBoardStore.getState().diaryNonce).toBe(before + 1);
    expect(screen.getByText("✓ Sincronizado")).toBeInTheDocument();
  });
});
