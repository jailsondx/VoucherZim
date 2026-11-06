import { VoucherCard } from "@/components/ui/VoucherCard";
import { VouchersPrintSheetProps } from "@/interfaces/vouchers-components";

// Fica oculta na tela e só aparece ao imprimir / salvar como PDF.
export function VouchersPrintSheet({ codes }: VouchersPrintSheetProps) {
  if (codes.length === 0) return null;

  return (
    <section
      className="hidden print:grid grid-cols-2 gap-4 w-full p-2 bg-white [print-color-adjust:exact]"
      aria-hidden="true"
    >
      {codes.map((code) => (
        <VoucherCard key={code} code={code} />
      ))}
    </section>
  );
}
