"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FolderKanban,
  Home,
  LogOut,
  PanelLeft,
  RotateCcw,
} from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin", label: "Genel Bakış", icon: Home },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/appointments", label: "Randevular", icon: CalendarDays },
] as const;

type AdminSidebarProps = {
  userEmail: string;
};

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#102B49]/10 bg-[#FBFAF7] lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
        <Link
          href="/admin"
          className="ed-interactive inline-flex min-h-11 items-center gap-3 font-serif text-base font-bold text-[#102B49] transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
        >
          <PanelLeft className="h-5 w-5 text-[#9A5C2F]" />
          <span>ERDEM ADMIN</span>
        </Link>
        <span className="hidden text-xs font-semibold text-[#102B49]/55 lg:mt-2 lg:block">
          {userEmail}
        </span>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-5 pb-4 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-0">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`ed-interactive inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] ${
                active
                  ? "bg-[#102B49] text-[#F6F2EA]"
                  : "text-[#102B49]/72 hover:bg-[#F6F2EA] hover:text-[#102B49]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden px-4 pb-5 pt-6 lg:block">
        <Link
          href="/"
          className="ed-interactive mb-2 inline-flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-semibold text-[#102B49]/72 transition-colors hover:bg-[#F6F2EA] hover:text-[#102B49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Siteye Dön</span>
        </Link>
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="ed-interactive inline-flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-4 text-sm font-semibold text-[#8A2E24] transition-colors hover:bg-[#FFF7F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
        </form>
      </div>

      <div className="flex gap-2 border-t border-[#102B49]/10 px-5 py-3 lg:hidden">
        <Link
          href="/"
          className="ed-interactive inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-[#102B49]/10 bg-white px-3 text-sm font-semibold text-[#102B49]/72"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Siteye Dön</span>
        </Link>
        <form action={logoutAdminAction} className="flex-1">
          <button
            type="submit"
            className="ed-interactive inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#9A3D2F]/20 bg-white px-3 text-sm font-semibold text-[#8A2E24]"
          >
            <LogOut className="h-4 w-4" />
            <span>Çıkış Yap</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
