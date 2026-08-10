import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminUser } from "@/lib/admin/auth";
import {
  getSupabaseBrowserConfig,
  SupabaseConfigurationError,
} from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  let isConfigured = true;

  try {
    getSupabaseBrowserConfig();
    const user = await getAdminUser();

    if (user) {
      redirect("/admin");
    }
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      isConfigured = false;
    } else {
      throw error;
    }
  }

  return (
    <main className="ed-admin-scope flex min-h-screen items-center justify-center bg-[#F6F2EA] px-4 py-10 text-[#102B49]">
      <section className="w-full max-w-md rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-6 shadow-sm sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#102B49] text-[#F6F2EA]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h1 className="ed-admin-title mt-6 font-serif text-4xl font-bold leading-tight">
          Yönetim Paneli
        </h1>
        <p className="ed-eyebrow mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
          Erdem Dizayn & Mekanik
        </p>

        <AdminLoginForm isConfigured={isConfigured} />

        <Link
          href="/"
          className="ed-interactive mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#102B49]/68 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
        >
          Siteye Dön
        </Link>
      </section>
    </main>
  );
}
