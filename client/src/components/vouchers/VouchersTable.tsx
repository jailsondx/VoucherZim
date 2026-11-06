"use client";

import { Pencil } from "lucide-react";

import { formatDateTime, formatSeconds } from "@/app/utils/voucher-formatters";
import { VoucherStatusBadge } from "@/components/vouchers/VoucherStatusBadge";
import { VoucherSentBadge } from "@/components/vouchers/VoucherSentBadge";
import { VouchersTableProps } from "@/interfaces/vouchers-components";

const COLUMN_COUNT = 7;
const EXPIRED_STATUS = 2;

const checkboxClass = "w-4 h-4 rounded accent-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30";

export function VouchersTable({
  vouchers,
  loading,
  selectedCodes,
  onToggleVoucher,
  onTogglePage,
  onEditComment,
}: VouchersTableProps) {
  // Vouchers vencidos não podem ser selecionados para impressão.
  const selectableCodes = vouchers.filter((voucher) => voucher.status !== EXPIRED_STATUS).map((voucher) => voucher.code);
  const selectedOnPage = selectableCodes.filter((code) => selectedCodes.has(code)).length;
  const allPageSelected = selectableCodes.length > 0 && selectedOnPage === selectableCodes.length;
  const somePageSelected = selectedOnPage > 0 && !allPageSelected;

  return (
    <div className="overflow-hidden rounded-t-xl border border-zinc-800 bg-zinc-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-xs uppercase font-semibold text-zinc-300 border-zinc-800 bg-zinc-800/60">
            <tr>
              <th className="w-10 pl-5 pr-2 py-3.5" scope="col">
                <input
                  className={checkboxClass}
                  type="checkbox"
                  aria-label="Selecionar todos os vouchers desta página"
                  checked={allPageSelected}
                  ref={(element) => {
                    if (element) element.indeterminate = somePageSelected;
                  }}
                  onChange={(event) => onTogglePage(selectableCodes, event.target.checked)}
                  disabled={loading || selectableCodes.length === 0}
                />
              </th>
              <th className="px-5 py-3.5" scope="col">
                Código (Voucher)
              </th>
              <th className="px-5 py-3.5" scope="col">
                Status
              </th>
              <th className="px-5 py-3.5" scope="col">
                Tempo Restante
              </th>
              <th className="px-5 py-3.5" scope="col">
                Destinatário / Comentário
              </th>
              <th className="px-5 py-3.5 whitespace-nowrap" scope="col">
                Data de Envio
              </th>
              <th className="px-5 py-3.5 text-right" scope="col">
                Ação
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr>
                <td className="px-5 py-12 text-center text-zinc-400" colSpan={COLUMN_COUNT} role="status">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-green-700 border-t-transparent animate-spin" />
                    <span>Carregando vouchers...</span>
                  </div>
                </td>
              </tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td className="px-5 py-12 text-center text-zinc-400" colSpan={COLUMN_COUNT}>
                  Nenhum voucher encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => {
                const isExpired = voucher.status === EXPIRED_STATUS;
                const isSelected = selectedCodes.has(voucher.code);

                return (
                  <tr
                    key={voucher.id}
                    className={`transition-colors ${isSelected ? "bg-green-950/30" : "hover:bg-zinc-800/40"}`}
                  >
                    <td className="w-10 pl-5 pr-2 py-4">
                      <input
                        className={checkboxClass}
                        type="checkbox"
                        aria-label={`Selecionar voucher ${voucher.code}`}
                        title={isExpired ? "Vouchers vencidos não podem ser impressos" : undefined}
                        checked={isSelected}
                        onChange={() => onToggleVoucher(voucher.code)}
                        disabled={isExpired}
                      />
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-base tracking-widest text-white">{voucher.code}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <VoucherStatusBadge status={voucher.status} />
                        {voucher.isSent && <VoucherSentBadge sentAt={voucher.sentAt} />}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-400">{formatSeconds(voucher.timeLeftSec)}</td>
                    <td className="px-5 py-4">
                      {voucher.organization || voucher.comment ? (
                        <div className="flex flex-col">
                          {voucher.organization ? (
                            <span className="font-medium text-zinc-200">{voucher.organization}</span>
                          ) : (
                            <span className="text-xs italic text-zinc-600">Sem destinatário</span>
                          )}
                          {voucher.comment && <span className="text-xs text-zinc-400">{voucher.comment}</span>}
                          {voucher.editedAt && (
                            <span className="mt-0.5 text-[11px] italic text-zinc-500">
                              editado em: {formatDateTime(voucher.editedAt)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs italic text-zinc-600">Sem destinatário</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-zinc-400">{formatDateTime(voucher.sentAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium text-zinc-300 border-zinc-700 bg-zinc-800 hover:text-white hover:bg-zinc-700 transition cursor-pointer"
                        type="button"
                        onClick={() => onEditComment(voucher)}
                        aria-label={`Editar destinatário e comentário do voucher ${voucher.code}`}
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
