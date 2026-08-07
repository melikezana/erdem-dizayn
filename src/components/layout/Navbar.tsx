"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenQuote: () => void;
}

const NAV_LINKS = [
  { label: "Ana Sayfa", href: "#hero" },
  { label: "Hakkımızda", href: "#philosophy" },
  { label: "Hizmetler", href: "#services" },
  { label: "Projeler", href: "#projects" },
  { label: "İletişim", href: "#contact" },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FBFAF7]/90 backdrop-blur-md border-b border-[#102B49]/10 py-3.5 shadow-xs"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Monogram */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded border border-[#102B49]/20 flex items-center justify-center bg-[#102B49] text-[#F6F2EA] font-serif font-bold text-base tracking-tighter shadow-sm group-hover:border-[#9A5C2F] transition-colors">
            ED
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-wider text-[#102B49] leading-tight">
              ERDEM
            </span>
            <span className="text-[9px] tracking-[0.24em] text-[#9A5C2F] uppercase font-mono font-semibold leading-none">
              DİZAYN & MEKANİK
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-mono tracking-widest uppercase text-[#102B49]/80 hover:text-[#9A5C2F] font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#9A5C2F] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenQuote}
            className="px-5 py-2.5 rounded-lg bg-[#102B49] hover:bg-[#9A5C2F] text-white text-xs font-mono tracking-wider uppercase font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Projenizi Konuşalım</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#102B49] hover:text-[#9A5C2F] focus:outline-none"
          aria-label="Menüyü Aç"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBFAF7] border-b border-[#102B49]/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono tracking-wider uppercase text-[#102B49] hover:text-[#9A5C2F] py-2 border-b border-black/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3 rounded-lg bg-[#102B49] text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
            >
              <span>Projenizi Konuşalım</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
