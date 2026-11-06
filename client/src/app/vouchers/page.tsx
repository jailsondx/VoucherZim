"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  EditVoucherMetaPayload,
  OmadaStatusFilter,
  PrintConfirmPayload,
  SystemStatusFilter,
  Voucher,
  VoucherCounts,
} from "@/interfaces/voucher";
import { useVouchers } from "../hooks/useVouchers";
import { VouchersHeader } from "@/components/vouchers/VouchersHeader";
import { VouchersSummary } from "@/components/vouchers/VouchersSummary";
import { VouchersFilters } from "@/components/vouchers/VouchersFilters";
import { VouchersSelectionBar } from "@/components/vouchers/VouchersSelectionBar";
import { VouchersTable } from "@/components/vouchers/VouchersTable";
import { VouchersPagination } from "@/components/vouchers/VouchersPagination";
import { VouchersError } from "@/components/vouchers/VouchersError";
import { VouchersPrintSheet } from "@/components/vouchers/VouchersPrintSheet";
import { PrintDialog } from "@/components/ui/PrintDialog";
import { EditCommentDialog } from "@/components/ui/EditCommentDialog";
import { PrintJob } from "@/interfaces/vouchers-components";

function matchesOmadaFilter(voucher: Voucher, filter: OmadaStatusFilter): boolean {
  return filter === "all" || String(voucher.status) === filter;
}

function matchesSystemFilter(voucher: Voucher, filter: SystemStatusFilter): boolean {
  if (filter === "sent") return Boolean(voucher.isSent);
  if (filter === "not_sent") return !voucher.isSent;
  return true;
}

export default function VouchersPage() {
  const { vouchers, vouchersGroupName, loading, error, fetchVouchers, markAsSent, editComment } = useVouchers();

  const [omadaFilter, setOmadaFilter] = useState<OmadaStatusFilter>("all");
  const [systemFilter, setSystemFilter] = useState<SystemStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedCodes, setSelectedCodes] = useState<ReadonlySet<string>>(() => new Set());
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printJob, setPrintJob] = useState<PrintJob | null>(null);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const counts = useMemo(() => {
    return vouchers.reduce<VoucherCounts>(
      (acc, voucher) => {
        acc.total++;

        if (voucher.status === 0) acc.notUsed++;
        else if (voucher.status === 1) acc.used++;
        else if (voucher.status === 2) acc.expired++;

        if (voucher.isSent) acc.sent++;

        return acc;
      },
      { total: 0, notUsed: 0, used: 0, expired: 0, sent: 0 },
    );
  }, [vouchers]);

  //Filtros
  const filteredVouchers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    //Pesquisa por código, comentário ou organização (OR) + filtros Omada e do Sistema (AND).
    return vouchers.filter((voucher) => {
      const matchesSearch =
        !query || voucher.code?.toLowerCase().includes(query) || voucher.comment?.toLowerCase().includes(query) || voucher.organization?.toLowerCase().includes(query);

      // Filtros Omada e do Sistema são combinados (E).
      return matchesOmadaFilter(voucher, omadaFilter) && matchesSystemFilter(voucher, systemFilter) && matchesSearch;
    });
  }, [vouchers, omadaFilter, systemFilter, searchTerm]);

  //Paginação
  const totalItems = filteredVouchers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Limita a página utilizada nos cálculos
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedVouchers = useMemo(
    () => filteredVouchers.slice(startIndex, startIndex + itemsPerPage),
    [filteredVouchers, startIndex, itemsPerPage],
  );

  // Seleção: mantém a ordem da lista e ignora códigos que sumiram ou venceram após atualizar.
  const selectedList = useMemo(
    () => vouchers.filter((voucher) => voucher.status !== 2 && selectedCodes.has(voucher.code)).map((v) => v.code),
    [vouchers, selectedCodes],
  );

  const toggleVoucher = useCallback((code: string) => {
    setSelectedCodes((previous) => {
      const next = new Set(previous);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const togglePage = useCallback((codes: string[], selected: boolean) => {
    setSelectedCodes((previous) => {
      const next = new Set(previous);
      for (const code of codes) {
        if (selected) next.add(code);
        else next.delete(code);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedCodes(new Set()), []);

  const closePrintDialog = useCallback(() => setIsPrintDialogOpen(false), []);
  const closeEditDialog = useCallback(() => setEditingVoucher(null), []);

  const handleConfirmEdit = async (payload: EditVoucherMetaPayload) => {
    if (!editingVoucher) return;

    await editComment(editingVoucher.code, payload);
    setEditingVoucher(null);
  };

  // 1) salva comentário + "Enviado" no JSON; 2) só então abre a impressão.
  const handleConfirmPrint = async (payload: PrintConfirmPayload) => {
    const codes = selectedList;

    setIsSubmitting(true);
    try {
      await markAsSent(codes, payload);

      setIsPrintDialogOpen(false);
      setSelectedCodes(new Set());
      setPrintJob({ id: Date.now(), codes });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abre o diálogo de impressão do navegador (onde é possível "Salvar como PDF").
  useEffect(() => {
    if (!printJob) return;

    const originalTitle = document.title;
    const date = new Date().toISOString().slice(0, 10);
    // O título vira o nome sugerido do arquivo PDF.
    document.title = `vouchers-${date}-${printJob.codes.length}un`;

    const restoreTitle = () => {
      document.title = originalTitle;
    };
    window.addEventListener("afterprint", restoreTitle, { once: true });

    // Aguarda o próximo frame para a folha de impressão já estar renderizada.
    const frame = window.requestAnimationFrame(() => window.print());

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("afterprint", restoreTitle);
      restoreTitle();
    };
  }, [printJob]);

  return (
    <>
      <main className="min-h-screen p-4 sm:p-6 md:p-8 text-zinc-200 bg-zinc-950 print:hidden">
        <div className="max-w-6xl mx-auto space-y-6">
          <VouchersHeader loading={loading} onRefresh={fetchVouchers} />

          <VouchersSummary counts={counts} />

          {error && <VouchersError message={error} onRetry={fetchVouchers} />}

          <VouchersFilters
            groupName={vouchersGroupName}
            searchTerm={searchTerm}
            omadaFilter={omadaFilter}
            systemFilter={systemFilter}
            itemsPerPage={itemsPerPage}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            onOmadaFilterChange={(value) => {
              setOmadaFilter(value);
              setCurrentPage(1);
            }}
            onSystemFilterChange={(value) => {
              setSystemFilter(value);
              setCurrentPage(1);
            }}
            onClearFilters={() => {
              setOmadaFilter("all");
              setSystemFilter("all");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />

          <VouchersSelectionBar
            selectedCount={selectedList.length}
            disabled={loading || isSubmitting}
            onClear={clearSelection}
            onPrint={() => setIsPrintDialogOpen(true)}
          />

          <section className="space-y-0">
            <VouchersTable
              vouchers={paginatedVouchers}
              loading={loading}
              selectedCodes={selectedCodes}
              onToggleVoucher={toggleVoucher}
              onTogglePage={togglePage}
              onEditComment={setEditingVoucher}
            />

            <VouchersPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              itemsPerPage={itemsPerPage}
              loading={loading}
              onPageChange={setCurrentPage}
            />
          </section>
        </div>
      </main>

      {isPrintDialogOpen && (
        <PrintDialog
          selectedCodes={selectedList}
          onClose={closePrintDialog}
          onConfirm={handleConfirmPrint}
          isSubmitting={isSubmitting}
        />
      )}

      {editingVoucher && (
        <EditCommentDialog
          key={editingVoucher.code}
          voucherCode={editingVoucher.code}
          initialComment={editingVoucher.comment ?? ""}
          initialOrganization={editingVoucher.organization ?? ""}
          onClose={closeEditDialog}
          onConfirm={handleConfirmEdit}
        />
      )}

      <VouchersPrintSheet key={printJob?.id} codes={printJob?.codes ?? []} />
    </>
  );
}
