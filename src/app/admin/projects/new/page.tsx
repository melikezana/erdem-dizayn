import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { AdminProjectCreateForm } from "@/components/admin/AdminProjectCreateForm";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function NewAdminProjectPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Yeni proje oluşturma kullanılamıyor."
        description={access.message}
      />
    );
  }

  return (
    <AdminShell userEmail={access.user.email}>
      <Link
        href="/admin/projects"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49]/72 transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Projeler</span>
      </Link>

      <div className="mt-4 border-b border-[#102B49]/10 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9A5C2F]">
          Yeni Proje
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#102B49]">
          Yeni Proje Oluştur
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#102B49]/72">
          Proje kodu bu formdan alınmaz. Kayıt tamamlandığında sunucu otomatik
          ve benzersiz bir takip kodu üretir.
        </p>
      </div>

      <AdminProjectCreateForm />
    </AdminShell>
  );
}
