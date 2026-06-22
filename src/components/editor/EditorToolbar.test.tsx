import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const action = vi.fn();

vi.mock("@milkdown/react", () => ({
  useInstance: () => [false, () => ({ action })],
}));

import { EditorToolbar } from "./EditorToolbar";

const CONTROLS = [
  "Negrita",
  "Cursiva",
  "Tachado",
  "Encabezado 1",
  "Encabezado 2",
  "Encabezado 3",
  "Lista de viñetas",
  "Lista numerada",
  "Lista de tareas",
  "Cita",
  "Código en línea",
  "Bloque de código",
  "Enlace",
];

beforeEach(() => action.mockClear());

describe("EditorToolbar", () => {
  it("renders nothing when not visible", () => {
    const { container } = render(<EditorToolbar visible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the formatting controls when visible", () => {
    render(<EditorToolbar visible />);
    for (const label of CONTROLS) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("activating a control dispatches a command to the editor", () => {
    render(<EditorToolbar visible />);
    fireEvent.click(screen.getByRole("button", { name: "Negrita" }));
    expect(action).toHaveBeenCalled();
    action.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Encabezado 2" }));
    expect(action).toHaveBeenCalled();
  });

  it("format buttons do not steal focus (mousedown prevented)", () => {
    render(<EditorToolbar visible />);
    const button = screen.getByRole("button", { name: "Negrita" });
    const ev = createEvent.mouseDown(button);
    fireEvent(button, ev);
    expect(ev.defaultPrevented).toBe(true);
  });

  it("the link control reveals a URL field and applies a link on submit", () => {
    render(<EditorToolbar visible />);
    fireEvent.click(screen.getByRole("button", { name: "Enlace" }));
    fireEvent.change(screen.getByLabelText("URL del enlace"), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar enlace" }));
    expect(action).toHaveBeenCalled();
  });
});
