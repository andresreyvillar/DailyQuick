import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useBoardStore } from "../../state/board-store";
import { OrientationToggle } from "./OrientationToggle";

beforeEach(() => {
  localStorage.clear();
  useBoardStore.setState({ orientation: "vertical" });
});

describe("OrientationToggle", () => {
  it("switches orientation via the segmented control and persists the choice", () => {
    render(<OrientationToggle />);
    const columns = screen.getByRole("button", { name: "División en columnas" });
    const rows = screen.getByRole("button", { name: "División en filas" });
    expect(columns).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(rows);

    expect(useBoardStore.getState().orientation).toBe("horizontal");
    expect(localStorage.getItem("dailyquick:orientation")).toBe("horizontal");
    expect(rows).toHaveAttribute("aria-pressed", "true");
  });
});
