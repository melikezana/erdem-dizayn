"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Camera, Menu, X } from "lucide-react";
import { BUSINESS_CONTACT } from "@/lib/contact";

interface NavbarProps {
  onOpenAppointment: () => void;
}

const NAV_LINKS = [
  { label: "Projeler", href: "#projects" },
  { label: "Hizmetler", href: "#services" },
  { label: "Hakkımızda", href: "#about" },
  { label: "İletişim", href: "#contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#102B49]/10 bg-[#F6F2EA]/90 py-3 shadow-sm backdrop-blur-md"
          : "bg-transparent py-5 sm:py-7"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a
          href="#hero"
          className="group flex min-h-11 items-center gap-3"
          onClick={closeMobileMenu}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded border border-[#102B49]/15 bg-[#102B49] font-serif text-sm font-bold text-[#F6F2EA]">
            ED
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-bold text-[#102B49] sm:text-lg">
              ERDEM
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A5C2F]">
              Dizayn & Mekanik
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="min-h-11 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#102B49]/72 transition-colors hover:text-[#102B49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={BUSINESS_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram profilini aç"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#102B49]/15 text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <Camera className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={onOpenAppointment}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-[#102B49] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <span>Randevu Oluştur</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#102B49]/10 bg-[#F6F2EA]/80 text-[#102B49] transition-colors hover:border-[#9A5C2F] md:hidden"
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="mx-4 mt-3 rounded-xl border border-[#102B49]/10 bg-[#FBFAF7] p-4 shadow-xl">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="min-h-12 border-b border-[#102B49]/10 px-2 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#102B49]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenAppointment();
                }}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-5 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F]"
              >
                <span>Randevu Oluştur</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <a
                href={BUSINESS_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profilini aç"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#102B49]/15 text-[#102B49]"
              >
                <Camera className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
