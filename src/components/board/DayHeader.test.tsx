import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DayHeader } from "./DayHeader";

describe("DayHeader", () => {
  it("renders the date in a human-readable Spanish form", () => {
    // Month is 0-indexed: 5 → June.
    render(<DayHeader date={new Date(2026, 5, 21)} />);
    expect(screen.getByRole("heading")).toHaveTextContent(/21 de junio de 2026/);
  });
});
