import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { requireAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Randevu yönetimi kapalı."
        description="Randevu talepleri API üzerinden Supabase'e yazılır. Listeleme ve durum güncelleme ekranı Supabase Auth doğrulaması tamamlanana kadar kapalı kalır."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-bold">Randevular</h1>
        <p className="mt-4 text-sm text-[#102B49]/72">
          Randevu listeleme Supabase Auth kurulumu sonrası etkinleştirilecek.
        </p>
      </div>
    </main>
  );
}
