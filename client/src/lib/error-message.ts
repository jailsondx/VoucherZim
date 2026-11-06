import axios from "axios";

import { VouchersErrorResponse } from "@/interfaces/voucher";

const DEFAULT_ERROR = "Não foi possível carregar os vouchers.";

// Converte erros de requisição em uma mensagem legível para o usuário.
export function getErrorMessage(err: unknown, fallback = DEFAULT_ERROR): string {
  if (axios.isAxiosError<VouchersErrorResponse>(err)) {
    const body = err.response?.data;

    if (body) {
      const message = body.message || body.erro;
      if (message && body.error) return `${message}: ${body.error}`;
      if (message) return message;
    }

    if (err.code === "ECONNABORTED") {
      return "O servidor demorou demais para responder. Tente novamente.";
    }

    if (!err.response) {
      return "Não foi possível conectar ao servidor.";
    }

    return fallback;
  }

  if (err instanceof Error) return err.message;

  return fallback;
}
