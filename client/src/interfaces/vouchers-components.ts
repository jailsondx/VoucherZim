import { OmadaStatusFilter, SystemStatusFilter, Voucher, VoucherCounts } from "@/interfaces/voucher";

export interface VoucherStatusBadgeProps {
  status: number;
}

export interface VouchersErrorProps {
  message: string;
  onRetry: () => void | Promise<void>;
}

export interface VouchersFiltersProps {
  groupName: string;
  searchTerm: string;
  omadaFilter: OmadaStatusFilter;
  systemFilter: SystemStatusFilter;
  itemsPerPage: number;
  onSearchChange: (value: string) => void;
  onOmadaFilterChange: (value: OmadaStatusFilter) => void;
  onSystemFilterChange: (value: SystemStatusFilter) => void;
  onClearFilters: () => void;
  onItemsPerPageChange: (value: number) => void;
}

export interface VouchersHeaderProps {
  loading: boolean;
  onRefresh: () => void | Promise<void>;
}

export interface VouchersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export interface VouchersSummaryProps {
  counts: VoucherCounts;
}

export interface VouchersTableProps {
  vouchers: Voucher[];
  loading: boolean;
  selectedCodes: ReadonlySet<string>;
  onToggleVoucher: (code: string) => void;
  onTogglePage: (codes: string[], selected: boolean) => void;
  onEditComment: (voucher: Voucher) => void;
}

export interface VouchersSelectionBarProps {
  selectedCount: number;
  disabled: boolean;
  onClear: () => void;
  onPrint: () => void;
}

export interface PrintJob {
  id: number;
  codes: string[];
}

export interface VouchersPrintSheetProps {
  codes: string[];
}

export interface VoucherSentBadgeProps {
  sentAt?: string;
}
