import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { addDays, todayKey } from "../../lib/date-key";
import { DayHeader } from "./DayHeader";

describe("DayHeader", () => {
  it("renders the date in a human-readable Spanish form with the year, inside a fixed slot", () => {
    render(<DayHeader dayKey="2026-06-21" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("21 de junio");
    expect(heading).toHaveTextContent("2026");
    expect(screen.getByTestId("date-slot")).toContainElement(heading);
  });

  it("marks today with a 'Hoy' indicator", () => {
    render(<DayHeader dayKey={todayKey()} />);
    expect(screen.getByText("Hoy")).toBeInTheDocument();
  });

  it("shows how long ago a past day is", () => {
    render(<DayHeader dayKey={addDays(todayKey(), -3)} />);
    expect(screen.getByText("hace 3 días")).toBeInTheDocument();
  });

  it("shows how far ahead a future day is", () => {
    render(<DayHeader dayKey={addDays(todayKey(), 2)} />);
    expect(screen.getByText("en 2 días")).toBeInTheDocument();
  });

  it("reads 'Ayer' and 'Mañana' for adjacent days", () => {
    const { unmount } = render(<DayHeader dayKey={addDays(todayKey(), -1)} />);
    expect(screen.getByText("Ayer")).toBeInTheDocument();
    unmount();
    render(<DayHeader dayKey={addDays(todayKey(), 1)} />);
    expect(screen.getByText("Mañana")).toBeInTheDocument();
  });
});
