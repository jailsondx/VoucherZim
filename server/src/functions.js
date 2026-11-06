/**************************************

filter.status valores validos
0 = Não utilizado (Vouchers ainda não usados)
1 =  Em uso (Vouchers que estão sendo utilizados)
2 = Expirado (Vouchers expirados)

****************************************/

import axios from "axios";
import https from "node:https";
import { getAccessToken, clearTokens } from "./services/omadaAuth.js";

const httpsAgent = new https.Agent({
  // Apenas para desenvolvimento local.
  // Em produção, configure o certificado confiável.
  rejectUnauthorized: false,
});

const PAGE_SIZE = 100;
const MAX_PAGES = 30;

// Códigos da Omada que indicam token inválido/expirado.
const TOKEN_ERROR_CODES = new Set([-44112, -44113]);

class OmadaApiError extends Error {
  constructor(errorCode, msg) {
    super(msg || `Erro da API Omada (código ${errorCode}).`);
    this.errorCode = errorCode;
  }
}

async function buscarPagina(url, page) {
  const token = await getAccessToken();

  const response = await axios.get(url, {
    params: { page, pageSize: PAGE_SIZE },
    httpsAgent,
    headers: {
      Authorization: `AccessToken=${token}`,
      Accept: "application/json",
    },
  });

  const body = response.data;

  // A Omada responde HTTP 200 mesmo em caso de erro; o status real vem em errorCode.
  if (body?.errorCode !== 0) {
    throw new OmadaApiError(body?.errorCode, body?.msg);
  }

  return body.result ?? {};
}

// Tenta de novo uma vez com token novo se a Omada recusar o token atual.
async function buscarPaginaComRetry(url, page) {
  try {
    return await buscarPagina(url, page);
  } catch (error) {
    if (error instanceof OmadaApiError && TOKEN_ERROR_CODES.has(error.errorCode)) {
      clearTokens();
      return buscarPagina(url, page);
    }

    throw error;
  }
}

export async function ObterListaVouchers() {
  const { OMADAURL, OMADAID, SITEID, GROUPID } = process.env;

  if (!OMADAURL || !OMADAID || !SITEID || !GROUPID) {
    return {
      success: false,
      message: "Variáveis de ambiente da Omada não configuradas.",
    };
  }

  const url = `${OMADAURL.replace(/\/$/, "")}/openapi/v1/${OMADAID}/sites/${SITEID}/hotspot/voucher-groups/${GROUPID}`;

  try {
    const vouchersPorId = new Map();
    let nomeGrupo = "";
    let totalRows = null;
    let paginasConsultadas = 0;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const resultado = await buscarPaginaComRetry(url, page);
      paginasConsultadas = page;

      if (page === 1) {
        nomeGrupo = resultado.name ?? "";
        totalRows = Number.isFinite(resultado.totalRows) ? resultado.totalRows : null;
      }

      const vouchers = Array.isArray(resultado.data) ? resultado.data : [];
      if (vouchers.length === 0) break;

      const antes = vouchersPorId.size;
      for (const voucher of vouchers) {
        vouchersPorId.set(voucher.id ?? voucher.code, voucher);
      }

      // A API repetiu os mesmos registros: não há mais páginas.
      if (vouchersPorId.size === antes) {
        console.log("Paginação interrompida: registros repetidos.");
        break;
      }

      if (vouchers.length < PAGE_SIZE) break;
      if (totalRows !== null && vouchersPorId.size >= totalRows) break;
    }

    const todosVouchers = [...vouchersPorId.values()];

    return {
      success: true,
      message: "Lista de vouchers obtida com sucesso",
      data: {
        name: nomeGrupo,
        totalRows: totalRows ?? todosVouchers.length,
        paginasConsultadas,
        data: todosVouchers,
      },
    };
  } catch (error) {
    const detalhe = error.response?.data?.msg || error.message;

    console.error("Erro ao obter lista de vouchers:", error.response?.data || error.message);

    return {
      success: false,
      message: "Erro ao obter lista de vouchers",
      error: detalhe,
    };
  }
}
