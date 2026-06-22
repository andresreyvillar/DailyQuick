import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DayHeader } from "./DayHeader";

describe("DayHeader", () => {
  it("renders the date in a human-readable Spanish form with the year", () => {
    // Month is 0-indexed: 5 → June.
    render(<DayHeader date={new Date(2026, 5, 21)} />);
    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("21 de junio");
    expect(heading).toHaveTextContent("2026");
  });
});
