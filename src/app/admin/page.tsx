import Link from "next/link";
import { CalendarDays, FolderKanban } from "lucide-react";
import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { requireAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Yönetim paneli korumada."
        description="Bu alan herkese açık düzenleme ekranı olarak yayınlanmaz. Supabase Auth oturum doğrulaması tamamlanana kadar proje ve randevu verileri görüntülenmez ya da düzenlenmez."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-bold">Admin</h1>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/projects"
            className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 transition-colors hover:border-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            <FolderKanban className="h-5 w-5 text-[#9A5C2F]" />
            <span className="mt-4 block font-semibold">Projeler</span>
          </Link>
          <Link
            href="/admin/appointments"
            className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-5 transition-colors hover:border-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
          >
            <CalendarDays className="h-5 w-5 text-[#9A5C2F]" />
            <span className="mt-4 block font-semibold">Randevular</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
