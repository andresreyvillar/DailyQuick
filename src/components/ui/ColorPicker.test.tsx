import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";

const ACCENT_NAMES = ["Azul", "Teal", "Verde", "Ámbar", "Rosa", "Violeta"];

describe("ColorPicker", () => {
  it("opens a palette of the six accents and closes on outside click", () => {
    render(<ColorPicker value="#4F7FD6" onChange={() => {}} label="Color de Oakmond" />);
    fireEvent.click(screen.getByLabelText("Color de Oakmond"));
    for (const name of ACCENT_NAMES) {
      expect(screen.getByLabelText(name)).toBeInTheDocument();
    }
    fireEvent.click(document.querySelector(".inset-0") as Element);
    expect(screen.queryByLabelText("Teal")).not.toBeInTheDocument();
  });

  it("picking an accent calls onChange with its hex and closes", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#4F7FD6" onChange={onChange} label="Color de Oakmond" />);
    fireEvent.click(screen.getByLabelText("Color de Oakmond"));
    fireEvent.click(screen.getByLabelText("Teal"));
    expect(onChange).toHaveBeenCalledWith("#2F9AA8");
    expect(screen.queryByLabelText("Teal")).not.toBeInTheDocument();
  });

  it("the custom input calls onChange with an arbitrary hex", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#4F7FD6" onChange={onChange} label="Color de Oakmond" />);
    fireEvent.click(screen.getByLabelText("Color de Oakmond"));
    fireEvent.change(screen.getByLabelText("Color personalizado"), { target: { value: "#123456" } });
    expect(onChange).toHaveBeenCalledWith("#123456");
  });
});
