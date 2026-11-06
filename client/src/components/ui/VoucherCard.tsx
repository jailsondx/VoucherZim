import { Wifi } from "lucide-react";

import { VoucherCardProps } from "@/interfaces/voucher";
import { VOUCHER_VALIDITY, VOUCHER_WIFI_SSID } from "@/lib/voucher-config";

// Modelo base do voucher impresso: apenas o código muda entre um cartão e outro.
export function VoucherCard({ code }: VoucherCardProps) {
  return (
    <article className="flex flex-col gap-3 w-full p-4 rounded-xl border-2 border-dashed border-zinc-400 bg-white text-zinc-900 break-inside-avoid">
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700">
            <Wifi className="w-5 h-5" aria-hidden="true" />
          </span>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Voucher de Acesso Wi-Fi
            </span>
            <span className="text-xs font-semibold text-zinc-800">{VOUCHER_WIFI_SSID}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">Validade</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold text-zinc-800 bg-zinc-100">{VOUCHER_VALIDITY}</span>
        </div>
      </header>

      <div className="flex flex-col items-center p-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Código do Voucher</span>
        <span className="mt-1 font-mono text-3xl font-extrabold tracking-widest text-zinc-900">{code}</span>
      </div>

      <ol className="flex flex-col gap-1 text-[11px] text-zinc-600">
        <li>
          <span className="font-semibold text-zinc-800">1.</span> Conecte na rede Wi-Fi{" "}
          <strong className="text-zinc-800">{VOUCHER_WIFI_SSID}</strong>.
        </li>
        <li>
          <span className="font-semibold text-zinc-800">2.</span> Insira o código acima no portal de autenticação.
        </li>
        <li>
          <span className="font-semibold text-zinc-800">3.</span> O acesso é válido por {VOUCHER_VALIDITY} a partir do
          primeiro uso.
        </li>
      </ol>
    </article>
  );
}
