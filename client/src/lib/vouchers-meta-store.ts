// Uso exclusivo no servidor (Route Handlers): depende de node:fs.
import { promises as fs } from "node:fs";
import path from "node:path";

import { VoucherMetaRecord, VouchersMetaStore } from "@/interfaces/voucher";

// Armazenamento de teste: um JSON local com os metadados indexados pelo código do voucher.
const STORE_PATH = path.join(process.cwd(), "src", "data", "vouchers-meta.json");

// Fila simples para que gravações simultâneas não sobrescrevam umas às outras.
let writeQueue: Promise<unknown> = Promise.resolve();

export async function readMetaStore(): Promise<VouchersMetaStore> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);

    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as VouchersMetaStore) : {};
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeMetaStore(store: VouchersMetaStore): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  // Grava em arquivo temporário e renomeia, para não deixar o JSON corrompido.
  const tempPath = `${STORE_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), "utf-8");
  await fs.rename(tempPath, STORE_PATH);
}

// Executa leitura + alteração + gravação em fila, um job por vez.
function enqueueUpdate(mutate: (store: VouchersMetaStore) => void): Promise<VouchersMetaStore> {
  const job = writeQueue.then(async () => {
    const store = await readMetaStore();
    mutate(store);
    await writeMetaStore(store);
    return store;
  });

  writeQueue = job.catch(() => undefined);
  return job;
}

// Nova impressão: grava um registro novo (descarta edições anteriores do comentário).
export function markVouchersAsSent(
  codes: string[],
  record: Pick<VoucherMetaRecord, "organization" | "comment" >,
): Promise<VouchersMetaStore> {
  const sentAt = new Date().toISOString();

  return enqueueUpdate((store) => {
    for (const code of codes) {
      store[code] = { ...record, isSent: true, sentAt };
    }
  });
}

// Edição manual do comentário/organização: preserva o status de envio e registra a data da edição.
export function updateVoucherComment(
  code: string,
  changes: Pick<VoucherMetaRecord, "organization" | "comment" >,
): Promise<VouchersMetaStore> {
  const editedAt = new Date().toISOString();

  return enqueueUpdate((store) => {
    const current = store[code] ?? { comment: "", organization: "", isSent: false, sentAt: "" };
    store[code] = { ...current, ...changes, editedAt };
  });
}
