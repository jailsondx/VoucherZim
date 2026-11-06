import { VouchersErrorProps } from "@/interfaces/vouchers-components";

export function VouchersError({ message, onRetry }: VouchersErrorProps) {
  return (
    <div
      role="alert"
      className="p-4 rounded-lg border bg-rose-950/40 border-rose-800 text-rose-300 flex items-start justify-between gap-3 text-sm"
    >
      <div className="flex gap-2 min-w-0">
        <span className="font-semibold shrink-0">Erro:</span>

        <span className="break-words">{message}</span>
      </div>

      <button
        type="button"
        onClick={() => void onRetry()}
        className="text-xs underline font-semibold hover:text-rose-100 shrink-0 cursor-pointer"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
