type Props = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Modal confirmation for deleting a project (reused by the drag-off-board delete gesture). */
export function DeleteConfirm({ title, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-[308px] rounded-[12px] border border-line bg-surface p-4 shadow-[0_12px_40px_rgba(20,24,33,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-3 text-[13px] text-body">
          ¿Eliminar “{title}”? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-[12.5px] font-medium text-body hover:bg-hover"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[#E5484D] px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-[#D33A3F]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
