import { Printer } from "lucide-react";

import { VouchersSelectionBarProps } from "@/interfaces/vouchers-components";

export function VouchersSelectionBar({ selectedCount, disabled, onClear, onPrint }: VouchersSelectionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <section
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm border-zinc-800 bg-zinc-900"
      aria-label="Vouchers selecionados"
    >
      <span className="text-zinc-400">
        {hasSelection ? (
          <>
            <strong className="text-white">{selectedCount}</strong> voucher(s) selecionado(s) para impressão
          </>
        ) : (
          "Marque os vouchers na tabela para gerar a impressão em PDF."
        )}
      </span>

      <div className="flex items-center justify-end gap-2">
        {hasSelection && (
          <button
            className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
            type="button"
            onClick={onClear}
            disabled={disabled}
          >
            Limpar seleção
          </button>
        )}

        <button
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-800 hover:bg-green-700 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          type="button"
          onClick={onPrint}
          disabled={disabled || !hasSelection}
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Imprimir selecionados
        </button>
      </div>
    </section>
  );
}
