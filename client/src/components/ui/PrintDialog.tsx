"use client";

import { FormEvent, useEffect, useState } from "react";
import { Printer, X } from "lucide-react";

import { PrintDialogProps } from "@/interfaces/voucher";
import { getErrorMessage } from "@/lib/error-message";

const MAX_COMMENT_LENGTH = 500;
const MAX_ORGANIZATION_LENGTH = 120;

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-lg border text-sm text-zinc-100 placeholder-zinc-500 border-zinc-700 bg-zinc-950 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-60";

// Renderize somente quando estiver aberto: assim os campos começam vazios a cada abertura.
export function PrintDialog({ selectedCodes, onClose, onConfirm, isSubmitting }: PrintDialogProps) {
  const [organization, setOrganization] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Fecha com Esc (exceto durante o envio).
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!organization.trim()) {
      setFormError("Informe o destinatário / setor antes de gerar a impressão.");
      return;
    }

    setFormError(null);

    try {
      await onConfirm({ organization: organization.trim(), comment: comment.trim() });
    } catch (err) {
      setFormError(getErrorMessage(err, "Não foi possível salvar os dados. Tente novamente."));
    }
  };

  return (
    <div
      className="flex items-center justify-center fixed inset-0 z-50 p-4 bg-black/80 backdrop-blur-xs print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-dialog-title"
    >
      <div className="w-full max-w-lg p-6 rounded-2xl border text-zinc-100 border-zinc-800 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-100" id="print-dialog-title">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg text-emerald-400 bg-emerald-500/10">
                <Printer className="w-4 h-4" aria-hidden="true" />
              </span>
              Gerar Impressão de Vouchers
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              O destinatário é obrigatório e ficará salvo nos vouchers, que passarão a ter o status{" "}
              <strong className="text-sky-400">Enviado</strong>.
            </p>
          </div>

          <button
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 transition disabled:opacity-50 cursor-pointer"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit} noValidate>
          <div className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/80">
            <div className="flex items-center justify-between mb-1.5 text-xs text-zinc-400">
              <span>Vouchers selecionados:</span>
              <span className="font-semibold text-emerald-400">{selectedCodes.length} código(s)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 pr-1 overflow-y-auto">
              {selectedCodes.map((code) => (
                <span
                  key={code}
                  className="px-2 py-0.5 rounded border font-mono text-xs font-semibold text-zinc-200 border-zinc-700 bg-zinc-800"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-lg border text-xs text-rose-300 border-rose-800 bg-rose-950/60" role="alert">
              {formError}
            </div>
          )}

          {/*Input de Destinatário / Setor */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
              htmlFor="print-organization"
            >
              Destinatário / Setor <span className="text-rose-400">*</span>
            </label>
            <input
              className={fieldClass}
              type="text"
              id="print-organization"
              maxLength={MAX_ORGANIZATION_LENGTH}
              autoFocus
              placeholder="Ex: Recursos Humanos, Recepção, TI..."
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {/*Input de Comentário / Finalidade */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
              htmlFor="print-comment"
            >
              Comentário / Finalidade <span className="normal-case font-normal text-zinc-500">(Opcional)</span>
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="print-comment"
              rows={2}
              maxLength={MAX_COMMENT_LENGTH}
              placeholder="Ex: Lote para novos colaboradores do setor de RH."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              type="submit"
              disabled={isSubmitting || !organization.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  Salvar e Gerar PDF
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
