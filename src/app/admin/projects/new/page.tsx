import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminProjectCreateForm } from "@/components/admin/AdminProjectCreateForm";
import { requireAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function NewAdminProjectPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Yeni proje oluşturma kapalı."
        description="Proje oluşturma akışı hazırlandı, ancak Supabase Auth doğrulaması tamamlanmadan admin mutasyonları çalıştırılmaz."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/projects"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Projeler</span>
        </Link>

        <div className="mt-6 border-b border-[#102B49]/10 pb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A5C2F]">
            Yeni Proje
          </span>
          <h1 className="mt-3 font-serif text-4xl font-bold">Yeni Proje</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102B49]/72">
            Proje kodu bu formdan alınmaz. Kayıt tamamlandığında sunucu otomatik
            bir takip kodu üretir.
          </p>
        </div>

        <AdminProjectCreateForm />
      </div>
    </main>
  );
}
