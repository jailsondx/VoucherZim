import axios from "axios";
import {
  VouchersResponse,
  VouchersMetaStore,
  SaveVoucherMetaPayload,
  SaveVoucherMetaResponse,
  UpdateVoucherCommentPayload,
} from "@/interfaces/voucher";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s: o backend pode paginar várias vezes na Omada
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVouchers = async (): Promise<VouchersResponse> => {
  const response = await api.get<VouchersResponse>("/api/get/ObterListaVouchersGrupo");
  return response.data;
};

// Metadados locais (comentário, organização, status Enviado), servidos pelas
// Route Handlers do próprio Next.js — por isso usam URL relativa, sem o baseURL do backend.
export const getVouchersMeta = async (): Promise<VouchersMetaStore> => {
  const response = await axios.get<VouchersMetaStore>("/api/vouchers-meta");
  return response.data;
};

export const saveVouchersMeta = async (payload: SaveVoucherMetaPayload): Promise<SaveVoucherMetaResponse> => {
  const response = await axios.post<SaveVoucherMetaResponse>("/api/vouchers-meta", payload);
  return response.data;
};

export const updateVoucherComment = async (
  payload: UpdateVoucherCommentPayload,
): Promise<SaveVoucherMetaResponse> => {
  const response = await axios.patch<SaveVoucherMetaResponse>("/api/vouchers-meta", payload);
  return response.data;
};
