import { beforeEach, describe, expect, it } from "vitest";

import { loadTheme, useThemeStore } from "./theme-store";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  useThemeStore.setState({ theme: "nitido" });
});

describe("theme store", () => {
  it("loadTheme defaults to nitido and reads a stored theme", () => {
    expect(loadTheme()).toBe("nitido");
    localStorage.setItem("dailyquick:theme", "bujo");
    expect(loadTheme()).toBe("bujo");
  });

  it("setTheme persists the choice and applies it to the document root", () => {
    useThemeStore.getState().setTheme("citrus");
    expect(localStorage.getItem("dailyquick:theme")).toBe("citrus");
    expect(document.documentElement.dataset.theme).toBe("citrus");
    expect(useThemeStore.getState().theme).toBe("citrus");
  });
});
