import { VouchersPaginationProps } from "@/interfaces/vouchers-components";

export function VouchersPagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  loading,
  onPageChange,
}: VouchersPaginationProps) {
  const pages: number[] = [];

  // Calcula somente as páginas que serão exibidas: primeira, última e vizinhas da atual.
  for (let page = 1; page <= totalPages; page++) {
    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
      pages.push(page);
    }
  }

  const firstItem = totalItems === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(startIndex + itemsPerPage, totalItems);

  const buttonClass =
    "px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer";

  return (
    <nav
      aria-label="Paginação dos vouchers"
      className="px-5 py-3.5 bg-zinc-900 border-x border-b border-zinc-800 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
    >
      <span className="text-xs text-zinc-400">
        Mostrando <strong className="text-zinc-200">{firstItem}</strong>
        {" a "}
        <strong className="text-zinc-200">{lastItem}</strong>
        {" de "}
        <strong className="text-zinc-200">{totalItems}</strong>
        {" vouchers"}
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1 || loading}
          className={buttonClass}
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            const previousPage = pages[index - 1];
            const showEllipsis = previousPage !== undefined && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center">
                {showEllipsis && (
                  <span aria-hidden="true" className="px-2 text-xs text-zinc-600">
                    ...
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  aria-label={`Ir para a página ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`w-7 h-7 text-xs font-medium rounded-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    currentPage === page
                      ? "bg-green-800 hover:bg-green-700 text-white font-bold"
                      : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {page}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages || loading}
          className={buttonClass}
        >
          Próxima
        </button>
      </div>
    </nav>
  );
}
