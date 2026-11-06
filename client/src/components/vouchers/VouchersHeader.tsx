"use client";

import Link from "next/link";
import { RefreshCcw } from "@/components/animate-ui/icons/refresh-ccw";
import { VouchersHeaderProps } from "@/interfaces/vouchers-components";

export function VouchersHeader({ loading, onRefresh }: VouchersHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800">
      {" "}
      <div>
        {" "}
        <div className="flex items-center gap-2 mb-1">
          {" "}
          <Link href="/" className="text-xs text-green-500 hover:underline flex items-center gap-1">
            {" "}
            ← Início{" "}
          </Link>{" "}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">VoucherZim (Omada)</h1>
        <p className="text-sm text-zinc-400">
          Gerencie, filtre e visualize o status e comentários dos vouchers de acesso.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void onRefresh()}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-green-800 hover:bg-green-700 disabled:opacity-50 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
      >
        <RefreshCcw size={20} animateOnHover />
        Atualizar Lista
      </button>
    </header>
  );
}
