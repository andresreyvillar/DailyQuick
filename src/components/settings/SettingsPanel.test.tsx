import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/event", () => ({ listen: vi.fn(() => Promise.resolve(() => {})) }));
vi.mock("../../lib/notes-api", () => ({ accessStatus: vi.fn(), testMailAccess: vi.fn() }));

import { accessStatus, testMailAccess } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { SettingsPanel } from "./SettingsPanel";

const mockAccessStatus = vi.mocked(accessStatus);
const mockTestMailAccess = vi.mocked(testMailAccess);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ settingsOpen: true });
  mockAccessStatus.mockResolvedValue({ claude: "2.1.215 (Claude Code)", slack: "needs-auth" });
});

describe("SettingsPanel", () => {
  it("renders the accesses with their status when open", async () => {
    render(<SettingsPanel />);
    expect(screen.getByText("Apple Mail")).toBeInTheDocument();
    expect(await screen.findByText("2.1.215 (Claude Code)")).toBeInTheDocument();
    expect(screen.getByText("Requiere autenticación")).toBeInTheDocument();
  });

  it("tests Apple Mail access and shows the result", async () => {
    mockTestMailAccess.mockResolvedValue("Acceso concedido · 2 cuentas de correo");
    render(<SettingsPanel />);

    fireEvent.click(screen.getByRole("button", { name: "Probar acceso" }));

    await waitFor(() => expect(mockTestMailAccess).toHaveBeenCalled());
    expect(await screen.findByText("Acceso concedido · 2 cuentas de correo")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    useBoardStore.setState({ settingsOpen: false });
    const { container } = render(<SettingsPanel />);
    expect(container).toBeEmptyDOMElement();
  });
});
