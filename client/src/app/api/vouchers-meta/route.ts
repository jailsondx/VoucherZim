import { connection } from "next/server";

import { SaveVoucherMetaPayload } from "@/interfaces/voucher";
import { markVouchersAsSent, readMetaStore, updateVoucherComment } from "@/lib/vouchers-meta-store";

const MAX_CODES_PER_REQUEST = 500;
const MAX_COMMENT_LENGTH = 500;
const MAX_ORGANIZATION_LENGTH = 120;

// Destinatário / setor: obrigatório.
function validateOrganization(organization: unknown): string | null {
  if (typeof organization !== "string" || organization.trim() === "") {
    return "O destinatário / setor é obrigatório.";
  }

  if (organization.trim().length > MAX_ORGANIZATION_LENGTH) {
    return `O destinatário / setor deve ter até ${MAX_ORGANIZATION_LENGTH} caracteres.`;
  }

  return null;
}

// Comentário: opcional.
function validateComment(comment: unknown): string | null {
  if (comment !== undefined && typeof comment !== "string") {
    return "Comentário inválido.";
  }

  if (typeof comment === "string" && comment.trim().length > MAX_COMMENT_LENGTH) {
    return `O comentário deve ter até ${MAX_COMMENT_LENGTH} caracteres.`;
  }

  return null;
}

export async function GET() {
  // Sempre lê o arquivo na hora da requisição (nunca pré-renderiza).
  await connection();

  try {
    const store = await readMetaStore();
    return Response.json(store);
  } catch (error) {
    console.error("Erro ao ler metadados dos vouchers:", error);
    return Response.json({ message: "Não foi possível ler os metadados dos vouchers." }, { status: 500 });
  }
}

function parsePayload(body: unknown): SaveVoucherMetaPayload | string {
  if (!body || typeof body !== "object") return "Corpo da requisição inválido.";

  const { voucherCodes, comment, organization } = body as Record<string, unknown>;

  if (!Array.isArray(voucherCodes) || voucherCodes.length === 0) {
    return "Selecione ao menos um voucher.";
  }

  if (voucherCodes.length > MAX_CODES_PER_REQUEST) {
    return `Máximo de ${MAX_CODES_PER_REQUEST} vouchers por impressão.`;
  }

  const codes = voucherCodes.filter((code): code is string => typeof code === "string" && code.trim() !== "");

  if (codes.length !== voucherCodes.length) {
    return "Lista de códigos de voucher inválida.";
  }

  const fieldError = validateOrganization(organization) ?? validateComment(comment);
  if (fieldError) return fieldError;

  return {
    voucherCodes: [...new Set(codes.map((code) => code.trim()))],
    comment: typeof comment === "string" ? comment.trim() : "",
    organization: (organization as string).trim(),
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "JSON inválido." }, { status: 400 });
  }

  const payload = parsePayload(body);

  if (typeof payload === "string") {
    return Response.json({ message: payload }, { status: 400 });
  }

  try {
    const store = await markVouchersAsSent(payload.voucherCodes, {
      organization: payload.organization,
      comment: payload.comment ?? "",
    });

    return Response.json({ success: true, store });
  } catch (error) {
    console.error("Erro ao salvar metadados dos vouchers:", error);
    return Response.json({ message: "Não foi possível salvar os metadados dos vouchers." }, { status: 500 });
  }
}

// Edição do destinatário e do comentário de um único voucher.
export async function PATCH(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "JSON inválido." }, { status: 400 });
  }

  const { voucherCode, comment, organization } = (body ?? {}) as Record<string, unknown>;

  if (typeof voucherCode !== "string" || voucherCode.trim() === "") {
    return Response.json({ message: "Código do voucher inválido." }, { status: 400 });
  }

  const fieldError = validateOrganization(organization) ?? validateComment(comment);

  if (fieldError) {
    return Response.json({ message: fieldError }, { status: 400 });
  }

  try {
    const store = await updateVoucherComment(voucherCode.trim(), {
      comment: typeof comment === "string" ? comment.trim() : "",
      organization: (organization as string).trim(),
    });
    return Response.json({ success: true, store });
  } catch (error) {
    console.error("Erro ao editar dados do voucher:", error);
    return Response.json({ message: "Não foi possível salvar as alterações." }, { status: 500 });
  }
}
