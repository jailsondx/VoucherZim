export type VoucherStatusType = 0 | 1 | 2; // 0 = Não usado, 1 = Usado, 2 = Vencido

// Filtro pelo status vindo da Omada (0 = Não usado, 1 = Usado, 2 = Vencido).
export type OmadaStatusFilter = 'all' | '0' | '1' | '2';

// Filtro pelo status personalizado do sistema (salvo localmente).
export type SystemStatusFilter = 'all' | 'sent' | 'not_sent';


export interface VoucherGroup {
  id: string;
  name: string;
}

export interface Voucher {
  id: string;
  code: string;
  status: number;
  startTime?: number;
  endTime?: number;
  timeUsedSec?: number;
  timeLeftSec?: number;
  timingByClientUsage?: boolean;
  organization?: string;
  comment?: string;
  isSent?: boolean;
  sentAt?: string;
  editedAt?: string;
}

export interface VoucherMetaRecord {
  organization: string;
  comment: string;
  isSent: boolean;
  sentAt: string;
  editedAt?: string;
}

export interface VouchersMetaStore {
  [code: string]: VoucherMetaRecord;
}

export interface VoucherGroupData {
  name: string;
  totalRows: number;
  paginasConsultadas: number;
  data: Voucher[];
}

export interface VouchersResponse {
  message: string;
  data: VoucherGroupData;
}

export interface VouchersErrorResponse {
  message?: string;
  error?: string;
  erro?: string;
}

export interface SaveVoucherMetaPayload {
  voucherCodes: string[];
  organization: string;
  comment?: string;
  
}

export interface SaveVoucherMetaResponse {
  success: boolean;
  store: VouchersMetaStore;
}

export interface PrintConfirmPayload {
  organization: string;
  comment: string;
}

export interface VoucherCounts {
  total: number;
  notUsed: number;
  used: number;
  expired: number;
  sent: number;
}

export interface VoucherCardProps {
  code: string;
}

export interface UpdateVoucherCommentPayload {
  voucherCode: string;
  organization: string;
  comment: string;
}

export interface EditVoucherMetaPayload {
  organization: string;
  comment: string;
}

export interface EditCommentDialogProps {
  voucherCode: string;
  initialOrganization: string;
  initialComment: string;
  onClose: () => void;
  onConfirm: (payload: EditVoucherMetaPayload) => Promise<void>;
}

export interface PrintDialogProps {
  selectedCodes: string[];
  onClose: () => void;
  onConfirm: (payload: PrintConfirmPayload) => Promise<void>;
  isSubmitting: boolean;
}
