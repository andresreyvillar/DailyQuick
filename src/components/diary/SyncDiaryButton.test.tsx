import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({ syncDiary: vi.fn() }));

import { syncDiary } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { SyncDiaryButton } from "./SyncDiaryButton";

const mockSyncDiary = vi.mocked(syncDiary);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-07-21", diaryNonce: 0 });
});

describe("SyncDiaryButton", () => {
  it("syncs the day and refreshes the diary on success", async () => {
    mockSyncDiary.mockResolvedValue("done");
    const before = useBoardStore.getState().diaryNonce;

    render(<SyncDiaryButton />);
    fireEvent.click(screen.getByRole("button", { name: "Sincronizar diario" }));

    await waitFor(() => expect(mockSyncDiary).toHaveBeenCalledWith("2026-07-21"));
    await waitFor(() => expect(useBoardStore.getState().diaryNonce).toBe(before + 1));
    expect(await screen.findByText("Diario sincronizado")).toBeInTheDocument();
  });

  it("shows an error toast when the sync fails", async () => {
    mockSyncDiary.mockRejectedValue(new Error("no claude"));

    render(<SyncDiaryButton />);
    fireEvent.click(screen.getByRole("button", { name: "Sincronizar diario" }));

    expect(await screen.findByText("No se pudo sincronizar el diario")).toBeInTheDocument();
    expect(useBoardStore.getState().diaryNonce).toBe(0);
  });
});
