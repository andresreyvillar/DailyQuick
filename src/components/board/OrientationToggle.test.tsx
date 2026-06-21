import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useBoardStore } from "../../state/board-store";
import { OrientationToggle } from "./OrientationToggle";

beforeEach(() => {
  localStorage.clear();
  useBoardStore.setState({ orientation: "vertical" });
});

describe("OrientationToggle", () => {
  it("toggles orientation and persists the choice", () => {
    render(<OrientationToggle />);
    const button = screen.getByRole("button", { name: /orientación/i });
    expect(button).toHaveTextContent("Columnas");

    fireEvent.click(button);

    expect(useBoardStore.getState().orientation).toBe("horizontal");
    expect(localStorage.getItem("dailyquick:orientation")).toBe("horizontal");
    expect(button).toHaveTextContent("Filas");
  });
});
