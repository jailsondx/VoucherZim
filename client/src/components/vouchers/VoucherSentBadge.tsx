import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/app/utils/voucher-formatters";
import { VoucherSentBadgeProps } from "@/interfaces/vouchers-components";

// Status personalizado (local): indica que o voucher já foi impresso/entregue.
export function VoucherSentBadge({ sentAt }: VoucherSentBadgeProps) {
  return (
    <span title={sentAt ? `Enviado em ${formatDateTime(sentAt)}` : "Enviado"}>
      <Badge
        value="enviado"
        bgcolor="bg-zinc-800"
        bordercolor="border-sky-700"
        textcolor="text-sky-400"
        dotColor="bg-sky-400"
      />
    </span>
  );
}
