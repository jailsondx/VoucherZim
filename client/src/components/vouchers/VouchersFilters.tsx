import { OmadaStatusFilter, SystemStatusFilter } from "@/interfaces/voucher";
import { VouchersFiltersProps } from "@/interfaces/vouchers-components";

const selectClass =
  "min-w-0 flex-1 px-3 py-2 rounded-lg border text-sm text-zinc-100 border-zinc-700 bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer";

const groupClass = "flex flex-col gap-2 flex-1 p-3 rounded-lg border border-zinc-800 bg-zinc-950/40";

const groupTitleClass = "text-[11px] font-semibold uppercase tracking-wider text-zinc-500";

export function VouchersFilters({
  groupName,
  searchTerm,
  omadaFilter,
  systemFilter,
  itemsPerPage,
  onSearchChange,
  onOmadaFilterChange,
  onSystemFilterChange,
  onClearFilters,
  onItemsPerPageChange,
}: VouchersFiltersProps) {
  const hasActiveFilters = omadaFilter !== "all" || systemFilter !== "all" || searchTerm.trim() !== "";

  return (
    <section className="flex flex-col gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-zinc-300">
          Grupo de Vouchers: <span className="font-semibold text-white">{groupName || "—"}</span>
        </span>

        {hasActiveFilters && (
          <button
            className="text-xs font-semibold text-green-500 hover:underline cursor-pointer"
            type="button"
            onClick={onClearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <label className="sr-only" htmlFor="voucher-search">
            Buscar vouchers por código, destinatário ou comentário
          </label>
          <input
            className="w-full pl-2 pr-4 py-2 rounded-lg border text-sm text-zinc-100 placeholder-slate-400 border-zinc-700 bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-green-700"
            type="search"
            id="voucher-search"
            placeholder="Buscar por código, destinatário ou comentário..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <label className="whitespace-nowrap text-xs font-semibold text-zinc-400" htmlFor="items-per-page">
            Exibir:
          </label>
          <select
            className="px-3 py-2 rounded-lg border text-sm text-zinc-100 border-zinc-700 bg-zinc-800/80 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer"
            id="items-per-page"
            value={itemsPerPage}
            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>

      {/* Os dois grupos são combinados (E): ex. "Não Usado" + "Enviado". */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={groupClass}>
          <label className={groupTitleClass} htmlFor="omada-filter">
            Filtros Omada
          </label>
          <select
            className={selectClass}
            id="omada-filter"
            value={omadaFilter}
            onChange={(event) => onOmadaFilterChange(event.target.value as OmadaStatusFilter)}
          >
            <option value="all">Todos os status</option>
            <option value="0">Não Usado</option>
            <option value="1">Usado</option>
            <option value="2">Vencido</option>
          </select>
        </div>

        <div className={groupClass}>
          <label className={groupTitleClass} htmlFor="system-filter">
            Filtros do Sistema
          </label>
          <select
            className={selectClass}
            id="system-filter"
            value={systemFilter}
            onChange={(event) => onSystemFilterChange(event.target.value as SystemStatusFilter)}
          >
            <option value="all">Todos</option>
            <option value="sent">Enviado</option>
            <option value="not_sent">Não Enviado</option>
          </select>
        </div>
      </div>
    </section>
  );
}
