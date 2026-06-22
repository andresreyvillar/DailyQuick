import { Crepe } from "@milkdown/crepe";
import { listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { useState, type CSSProperties } from "react";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

import { EditorToolbar } from "./EditorToolbar";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
  /** Project accent used (via the `--col-accent` CSS variable) for checkboxes/links/selection. */
  accent?: string;
};

function CrepeEditor({ value, onChange, accent }: Props) {
  const [focused, setFocused] = useState(false);

  useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: value });
    crepe.editor.config((ctx) => {
      ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
        onChange(markdown);
      });
    });
    return crepe;
  });

  return (
    // Focus-within wrapper: the toolbar shows only while focus is inside the editor area (editor or
    // the link field), so moving focus between them does not hide it.
    <div
      className="flex h-full flex-col"
      style={accent ? ({ "--col-accent": accent } as CSSProperties) : undefined}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <EditorToolbar visible={focused} />
      <div className="min-h-0 flex-1">
        <Milkdown />
      </div>
    </div>
  );
}

/**
 * Notion-style Markdown editor (Milkdown Crepe). Effectively uncontrolled: initialized once with
 * `value` and emits GFM Markdown via `onChange`. Remount it (React `key`) to load a different note.
 * A formatting toolbar appears at the top while the editor has focus.
 */
export function MarkdownEditor({ value, onChange, accent }: Props) {
  return (
    <MilkdownProvider>
      <CrepeEditor value={value} onChange={onChange} accent={accent} />
    </MilkdownProvider>
  );
}
