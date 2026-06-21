import { Crepe } from "@milkdown/crepe";
import { listenerCtx } from "@milkdown/kit/plugin/listener";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
};

function CrepeEditor({ value, onChange }: Props) {
  useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: value });
    crepe.editor.config((ctx) => {
      ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
        onChange(markdown);
      });
    });
    return crepe;
  });

  return <Milkdown />;
}

/**
 * Notion-style Markdown editor (Milkdown Crepe). Effectively uncontrolled: initialized once with
 * `value` and emits GFM Markdown via `onChange`. Remount it (React `key`) to load a different note.
 */
export function MarkdownEditor({ value, onChange }: Props) {
  return (
    <MilkdownProvider>
      <CrepeEditor value={value} onChange={onChange} />
    </MilkdownProvider>
  );
}
