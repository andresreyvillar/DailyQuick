import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useThemeStore } from "../../state/theme-store";
import { ThemeSelector } from "./ThemeSelector";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  useThemeStore.setState({ theme: "nitido" });
});

describe("ThemeSelector", () => {
  it("opens a popover listing the three themes", () => {
    render(<ThemeSelector />);
    fireEvent.click(screen.getByRole("button", { name: "Cambiar tema" }));
    expect(screen.getByText("Nítido")).toBeInTheDocument();
    expect(screen.getByText("Bullet Journal")).toBeInTheDocument();
    expect(screen.getByText("Cítrico")).toBeInTheDocument();
  });

  it("selecting a theme calls setTheme; outside click closes without changing", () => {
    render(<ThemeSelector />);

    // Outside click closes without changing the theme.
    fireEvent.click(screen.getByRole("button", { name: "Cambiar tema" }));
    fireEvent.click(document.querySelector(".inset-0") as Element);
    expect(screen.queryByText("Bullet Journal")).not.toBeInTheDocument();
    expect(useThemeStore.getState().theme).toBe("nitido");

    // Choosing a theme applies it.
    fireEvent.click(screen.getByRole("button", { name: "Cambiar tema" }));
    fireEvent.click(screen.getByText("Bullet Journal"));
    expect(useThemeStore.getState().theme).toBe("bujo");
    expect(document.documentElement.dataset.theme).toBe("bujo");
  });
});
