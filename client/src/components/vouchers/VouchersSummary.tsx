import { CardKPI } from "@/components/ui/CardKPI";
import { VouchersSummaryProps } from "@/interfaces/vouchers-components";

export function VouchersSummary({ counts }: VouchersSummaryProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" aria-label="Resumo dos vouchers">
      <CardKPI
        title="Total"
        value={counts.total}
        bgcolor="bg-zinc-900"
        bordercolor="border-zinc-800"
        textcolor="text-white"
      />

      <CardKPI
        title="Não Usados"
        value={counts.notUsed}
        bgcolor="bg-zinc-900"
        bordercolor="border-zinc-800"
        textcolor="text-emerald-400"
      />

      <CardKPI
        title="Usados"
        value={counts.used}
        bgcolor="bg-zinc-900"
        bordercolor="border-zinc-800"
        textcolor="text-blue-400"
      />

      <CardKPI
        title="Vencidos"
        value={counts.expired}
        bgcolor="bg-zinc-900"
        bordercolor="border-zinc-800"
        textcolor="text-rose-400"
      />

      <CardKPI
        title="Enviados"
        value={counts.sent}
        bgcolor="bg-zinc-900"
        bordercolor="border-zinc-800"
        textcolor="text-sky-400"
      />
    </section>
  );
}
