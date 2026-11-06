// components/vouchers/VoucherStatusBadge.tsx

import { Badge } from "@/components/ui/Badge";
import { VoucherStatusBadgeProps } from "@/interfaces/vouchers-components";

export function VoucherStatusBadge({
  status,
}: VoucherStatusBadgeProps) {
  switch (status) {
    case 0:
      return (
        <Badge
          value="não usado"
          bgcolor="bg-zinc-800"
          bordercolor="border-emerald-400"
          textcolor="text-emerald-400"
          dotColor="bg-emerald-400"
          animate="animate-pulse"
        />
      );

    case 1:
      return (
        <Badge
          value="usado"
          bgcolor="bg-zinc-800"
          bordercolor="border-blue-500"
          textcolor="text-blue-400"
          dotColor="bg-blue-400"
        />
      );

    case 2:
      return (
        <Badge
          value="vencido"
          bgcolor="bg-zinc-800"
          bordercolor="border-rose-800"
          textcolor="text-rose-400"
          dotColor="bg-rose-400"
        />
      );

    default:
      return (
        <Badge
          value={`desconhecido (${status})`}
          bgcolor="bg-zinc-800"
          bordercolor="border-zinc-700"
          textcolor="text-gray-400"
          dotColor="bg-gray-400"
        />
      );
  }
}