import { editorViewCtx } from "@milkdown/kit/core";
import {
  createCodeBlockCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
  toggleStrongCommand,
} from "@milkdown/kit/preset/commonmark";
import { toggleStrikethroughCommand } from "@milkdown/kit/preset/gfm";
import { callCommand } from "@milkdown/kit/utils";
import { useInstance } from "@milkdown/react";
import { useState, type ReactNode } from "react";

type Props = { visible: boolean };

const btn =
  "flex h-7 min-w-7 items-center justify-center rounded-md px-1 text-[12.5px] text-muted hover:bg-hover";

/** Formatting toolbar shown at the top of a focused editor; controls dispatch Milkdown commands. */
export function EditorToolbar({ visible }: Props) {
  const [, getEditor] = useInstance();
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");

  if (!visible) return null;

  function Button({ label, onRun, children }: { label: string; onRun: () => void; children: ReactNode }) {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        // Keep the editor's selection: never let the button take focus.
        onMouseDown={(e) => e.preventDefault()}
        onClick={onRun}
        className={btn}
      >
        {children}
      </button>
    );
  }

  function toggleTaskList() {
    const editor = getEditor();
    if (!editor) return;
    editor.action(callCommand(wrapInBulletListCommand.key));
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { state } = view;
      const itemType = state.schema.nodes.list_item;
      if (!itemType) return;
      const { from, to } = state.selection;
      let tr = state.tr;
      let changed = false;
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type === itemType && node.attrs.checked === null) {
          tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, checked: false });
          changed = true;
        }
      });
      if (changed) view.dispatch(tr);
    });
  }

  function applyLink() {
    const url = href.trim();
    if (url) getEditor()?.action(callCommand(toggleLinkCommand.key, { href: url }));
    setLinkOpen(false);
    setHref("");
    getEditor()?.action((ctx) => ctx.get(editorViewCtx).focus());
  }

  const Divider = () => <span className="mx-0.5 h-4 w-px bg-line" aria-hidden="true" />;

  return (
    <div
      role="toolbar"
      aria-label="Formato"
      className="flex flex-wrap items-center gap-0.5 border-b border-line-soft bg-surface px-2 py-1"
    >
      <Button label="Negrita" onRun={() => getEditor()?.action(callCommand(toggleStrongCommand.key))}>
        <b>B</b>
      </Button>
      <Button label="Cursiva" onRun={() => getEditor()?.action(callCommand(toggleEmphasisCommand.key))}>
        <i>I</i>
      </Button>
      <Button label="Tachado" onRun={() => getEditor()?.action(callCommand(toggleStrikethroughCommand.key))}>
        <s>S</s>
      </Button>
      <Divider />
      <Button label="Encabezado 1" onRun={() => getEditor()?.action(callCommand(wrapInHeadingCommand.key, 1))}>
        <span className="text-[11px] font-semibold">H1</span>
      </Button>
      <Button label="Encabezado 2" onRun={() => getEditor()?.action(callCommand(wrapInHeadingCommand.key, 2))}>
        <span className="text-[11px] font-semibold">H2</span>
      </Button>
      <Button label="Encabezado 3" onRun={() => getEditor()?.action(callCommand(wrapInHeadingCommand.key, 3))}>
        <span className="text-[11px] font-semibold">H3</span>
      </Button>
      <Divider />
      <Button label="Lista de viñetas" onRun={() => getEditor()?.action(callCommand(wrapInBulletListCommand.key))}>
        •
      </Button>
      <Button label="Lista numerada" onRun={() => getEditor()?.action(callCommand(wrapInOrderedListCommand.key))}>
        <span className="text-[11px] font-semibold">1.</span>
      </Button>
      <Button label="Lista de tareas" onRun={toggleTaskList}>
        ☑
      </Button>
      <Button label="Cita" onRun={() => getEditor()?.action(callCommand(wrapInBlockquoteCommand.key))}>
        ❝
      </Button>
      <Divider />
      <Button label="Código en línea" onRun={() => getEditor()?.action(callCommand(toggleInlineCodeCommand.key))}>
        <span className="font-mono text-[12px]">{"<>"}</span>
      </Button>
      <Button label="Bloque de código" onRun={() => getEditor()?.action(callCommand(createCodeBlockCommand.key))}>
        <span className="font-mono text-[12px]">{"{ }"}</span>
      </Button>
      <Button label="Enlace" onRun={() => setLinkOpen((v) => !v)}>
        🔗
      </Button>
      {linkOpen && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyLink();
          }}
          className="ml-1 flex items-center gap-1"
        >
          <input
            aria-label="URL del enlace"
            value={href}
            autoFocus
            onChange={(e) => setHref(e.target.value)}
            placeholder="https://…"
            className="h-7 w-44 rounded-md border border-line-field bg-field px-2 text-[12.5px] text-body outline-none"
          />
          <button
            type="submit"
            aria-label="Aplicar enlace"
            onMouseDown={(e) => e.preventDefault()}
            className="h-7 rounded-md bg-ink px-2 text-[12px] font-semibold text-white"
          >
            OK
          </button>
        </form>
      )}
    </div>
  );
}
