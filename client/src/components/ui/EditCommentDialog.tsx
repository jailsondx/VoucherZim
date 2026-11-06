"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, X } from "lucide-react";

import { EditCommentDialogProps } from "@/interfaces/voucher";
import { getErrorMessage } from "@/lib/error-message";

const MAX_COMMENT_LENGTH = 500;
const MAX_ORGANIZATION_LENGTH = 120;

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-lg border text-sm text-zinc-100 placeholder-zinc-500 border-zinc-700 bg-zinc-950 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition disabled:opacity-60";

// Renderize somente quando estiver aberto: os campos começam com os valores atuais a cada abertura.
export function EditCommentDialog({
  voucherCode,
  initialComment,
  initialOrganization,
  onClose,
  onConfirm,
}: EditCommentDialogProps) {
  const [comment, setComment] = useState(initialComment);
  const [organization, setOrganization] = useState(initialOrganization);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const trimmed = comment.trim();
  const trimmedOrganization = organization.trim();
  const unchanged = trimmed === initialComment.trim() && trimmedOrganization === initialOrganization.trim();

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

    if (!trimmedOrganization) {
      setFormError("O destinatário / setor não pode ficar vazio.");
      return;
    }

    if (unchanged) {
      onClose();
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await onConfirm({ comment: trimmed, organization: trimmedOrganization });
    } catch (err) {
      setFormError(getErrorMessage(err, "Não foi possível salvar as alterações. Tente novamente."));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center fixed inset-0 z-50 p-4 bg-black/80 backdrop-blur-xs print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-comment-title"
    >
      <div className="w-full max-w-md p-6 rounded-2xl border text-zinc-100 border-zinc-800 bg-zinc-900 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-100" id="edit-comment-title">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg text-emerald-400 bg-emerald-500/10">
                <Pencil className="w-4 h-4" aria-hidden="true" />
              </span>
              Editar Voucher
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              Voucher <strong className="font-mono tracking-widest text-zinc-200">{voucherCode}</strong>
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
          {formError && (
            <div className="p-3 rounded-lg border text-xs text-rose-300 border-rose-800 bg-rose-950/60" role="alert">
              {formError}
            </div>
          )}

          {/*Input de Destinatário / Setor */}
          <div>
            <label
              className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
              htmlFor="edit-organization"
            >
              Destinatário / Setor <span className="text-rose-400">*</span>
            </label>
            <input
              className={fieldClass}
              type="text"
              id="edit-organization"
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
              htmlFor="edit-comment"
            >
              Comentário <span className="normal-case font-normal text-zinc-500">(Opcional)</span>
            </label>
            <textarea
              className={`${fieldClass} resize-none`}
              id="edit-comment"
              rows={2}
              maxLength={MAX_COMMENT_LENGTH}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              disabled={isSubmitting}
            />
            <span className="block mt-1 text-right text-[11px] text-zinc-500">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </span>
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
              disabled={isSubmitting || !trimmedOrganization || unchanged}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
