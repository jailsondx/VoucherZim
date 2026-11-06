import Link from 'next/link';
import { Wifi } from '@/components/animate-ui/icons/wifi';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-200">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-950/60 text-green-400">
          <Wifi animateOnHover />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            VoucherZim
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Painel de gerenciamento e controle de vouchers Wi-Fi gerados no sistema Omada.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/vouchers"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-green-800 hover:bg-green-700 rounded-xl transition shadow-md cursor-pointer"
          >
            Ver Lista de Vouchers
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
