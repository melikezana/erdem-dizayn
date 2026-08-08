import { AdminLockedState } from "@/components/admin/AdminLockedState";
import { requireAdminAccess } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

const PROJECT_MANAGEMENT_CAPABILITIES = [
  "Proje oluşturma",
  "Proje düzenleme",
  "Güncel aşama değiştirme",
  "İlerleme yüzdesi güncelleme",
  "Zaman çizelgesine güncelleme ekleme",
  "Müşteriye açık notu düzenleme",
];

export default async function AdminProjectsPage() {
  const access = await requireAdminAccess();

  if (!access.allowed) {
    return (
      <AdminLockedState
        title="Proje yönetimi kapalı."
        description="Proje yönetim mimarisi hazırlandı, ancak Supabase Auth doğrulaması tamamlanmadan proje kayıtları listelenmez, oluşturulmaz veya düzenlenmez."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 py-10 text-[#102B49] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-bold">Projeler</h1>
        <ul className="mt-8 grid grid-cols-1 gap-3">
          {PROJECT_MANAGEMENT_CAPABILITIES.map((capability) => (
            <li
              key={capability}
              className="rounded-lg border border-[#102B49]/10 bg-[#FBFAF7] p-4 text-sm font-semibold"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
