import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { ADMIN_AUTH_SETUP_STEPS } from "@/lib/admin/auth";

type AdminLockedStateProps = {
  title: string;
  description: string;
};

export function AdminLockedState({ title, description }: AdminLockedStateProps) {
  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex min-h-14 items-center justify-between gap-4 border-b border-[#102B49]/10 pb-5">
          <Link
            href="/#hero"
            className="font-serif text-base font-bold text-[#102B49] transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            ERDEM DİZAYN & MEKANİK
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            Siteye dön
          </Link>
        </div>

        <section className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 shadow-sm sm:p-8">
          <LockKeyhole className="h-10 w-10 text-[#9A5C2F]" />
          <h1 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#102B49] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#102B49]/72 sm:text-base">
            {description}
          </p>

          <div className="mt-8 border-t border-[#102B49]/10 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
              Supabase Auth kurulumu
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 text-sm leading-6 text-[#102B49]/76">
              {ADMIN_AUTH_SETUP_STEPS.map((step) => (
                <li
                  key={step}
                  className="border-b border-[#102B49]/10 pb-3 last:border-b-0"
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
