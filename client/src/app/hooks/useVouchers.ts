// hooks/useVouchers.ts

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getVouchers, getVouchersMeta, saveVouchersMeta, updateVoucherComment } from "@/services/api";
import { EditVoucherMetaPayload, PrintConfirmPayload, Voucher, VouchersMetaStore } from "@/interfaces/voucher";
import { getErrorMessage } from "@/lib/error-message";

// Metadados locais não devem impedir a listagem: em caso de falha, segue sem eles.
async function loadMetaSafely(): Promise<VouchersMetaStore> {
  try {
    return await getVouchersMeta();
  } catch (err) {
    console.warn("Não foi possível carregar os metadados dos vouchers:", err);
    return {};
  }
}

export function useVouchers() {
  const [omadaVouchers, setOmadaVouchers] = useState<Voucher[]>([]);
  const [meta, setMeta] = useState<VouchersMetaStore>({});
  const [vouchersGroupName, setVouchersGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialFetchStarted = useRef(false);

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [response, metaStore] = await Promise.all([getVouchers(), loadMetaSafely()]);
      const group = response.data;

      setVouchersGroupName(group?.name ?? "");
      setOmadaVouchers(Array.isArray(group?.data) ? group.data : []);
      setMeta(metaStore);
    } catch (err: unknown) {
      console.error("Erro ao buscar vouchers:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Salva destinatário, comentário e status "Enviado" nos vouchers impressos. Lança erro em caso de falha.
  const markAsSent = useCallback(async (codes: string[], payload: PrintConfirmPayload) => {
    const result = await saveVouchersMeta({
      voucherCodes: codes,
      comment: payload.comment,
      organization: payload.organization,
    });

    setMeta(result.store);
  }, []);

  // Edita destinatário e comentário de um voucher (registra a data da edição). Lança erro em caso de falha.
  const editComment = useCallback(async (code: string, payload: EditVoucherMetaPayload) => {
    const result = await updateVoucherComment({ voucherCode: code, ...payload });

    setMeta(result.store);
  }, []);

  useEffect(() => {
    if (initialFetchStarted.current) return;

    initialFetchStarted.current = true;

    void fetchVouchers();
  }, [fetchVouchers]);

  // Junta os dados da Omada com os metadados locais (os dados locais têm prioridade).
  const vouchers = useMemo<Voucher[]>(
    () =>
      omadaVouchers.map((voucher) => {
        const record = meta[voucher.code];
        if (!record) return voucher;

        return {
          ...voucher,
          comment: record.comment || undefined,
          organization: record.organization || undefined,
          isSent: record.isSent,
          sentAt: record.sentAt || undefined,
          editedAt: record.editedAt,
        };
      }),
    [omadaVouchers, meta],
  );

  return {
    vouchers,
    vouchersGroupName,
    loading,
    error,
    fetchVouchers,
    markAsSent,
    editComment,
  };
}
