import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail: string;
};

export function AdminShell({ children, userEmail }: AdminShellProps) {
  return (
    <div className="ed-admin-scope min-h-screen bg-[#F6F2EA] text-[#102B49] lg:flex">
      <AdminSidebar userEmail={userEmail} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
