import axios from "axios";
import https from "node:https";

let accessToken = null;
let refreshToken = null;
let expiresAt = 0;
let tokenPromise = null;

const httpsAgent = new https.Agent({
  // Apenas para desenvolvimento local.
  // Em produção, configure o certificado confiável.
  rejectUnauthorized: false,
});

// Lido sob demanda para não derrubar o servidor no import se a variável faltar.
function getTokenUrl() {
  const { OMADAURL } = process.env;

  if (!OMADAURL) {
    throw new Error("Variável OMADAURL não configurada.");
  }

  return `${OMADAURL.replace(/\/$/, "")}/openapi/authorize/token`;
}

function saveTokens(result) {
  if (!result?.accessToken || !result?.refreshToken) {
    throw new Error("O Omada não retornou os tokens esperados.");
  }

  accessToken = result.accessToken;
  refreshToken = result.refreshToken;

  const expiresIn = Number(result.expiresIn || 7200);
  expiresAt = Date.now() + Math.max(0, expiresIn - 60) * 1000;
}

// Descarta os tokens em cache (ex.: quando a Omada recusa o token).
export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  expiresAt = 0;
}

// Autenticação inicial
async function authenticate() {
  const { OMADAID, API_CLIENTID, API_CLIENTSECRET } = process.env;

  const response = await axios.post(
    getTokenUrl(),
    {
      omadacId: OMADAID,
      client_id: API_CLIENTID,
      client_secret: API_CLIENTSECRET,
    },
    {
      params: { grant_type: "client_credentials" },
      httpsAgent,
    },
  );

  const body = response.data;

  if (body.errorCode !== 0) {
    throw new Error(body.msg || "Falha na autenticação Omada.");
  }

  saveTokens(body.result);
  return accessToken;
}

// Renovação do token
async function renewToken() {
  const { API_CLIENTID, API_CLIENTSECRET } = process.env;

  const response = await axios.post(
    getTokenUrl(),
    {
      client_id: API_CLIENTID,
      client_secret: API_CLIENTSECRET,
    },
    {
      params: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      },
      httpsAgent,
    },
  );

  const body = response.data;

  if (body.errorCode !== 0) {
    throw new Error(body.msg || "Falha ao renovar token Omada.");
  }

  saveTokens(body.result);
  return accessToken;
}

// Obtenha o token sempre por esta função
export async function getAccessToken() {
  if (accessToken && Date.now() < expiresAt) {
    return accessToken;
  }

  if (!tokenPromise) {
    tokenPromise = (async () => {
      if (refreshToken) {
        try {
          return await renewToken();
        } catch (error) {
          // Refresh token inválido/expirado: autentica do zero.
          console.warn("Falha ao renovar token Omada, autenticando novamente:", error.message);
          clearTokens();
        }
      }

      return authenticate();
    })().finally(() => {
      tokenPromise = null;
    });
  }

  return tokenPromise;
}
