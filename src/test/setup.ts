import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// React Testing Library does not auto-clean between tests unless Vitest globals
// are enabled; register cleanup explicitly so renders don't accumulate.
afterEach(() => {
  cleanup();
});
