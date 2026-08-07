"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenQuote: () => void;
}

const NAV_LINKS = [
  { label: "Hakkımızda", href: "#statement-1" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F6F2EA]/90 backdrop-blur-md border-b border-[#102B49]/08 py-4"
          : "bg-transparent py-6 sm:py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo / Typography */}
        <a href="#hero" className="flex items-baseline gap-2 group">
          <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#102B49] leading-none">
            ERDEM
          </span>
          <span className="text-[10px] sm:text-xs tracking-[0.24em] text-[#9A5C2F] uppercase font-mono font-semibold">
            DİZAYN & MEKANİK
          </span>
        </a>

        {/* Minimal Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-mono tracking-[0.2em] uppercase text-[#102B49]/70 hover:text-[#102B49] font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#9A5C2F] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onOpenQuote}
            className="px-5 py-2.5 rounded-full border border-[#102B49]/20 hover:border-[#102B49] bg-[#102B49] hover:bg-[#9A5C2F] text-white text-xs font-mono tracking-wider uppercase font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Projenizi Konuşalım</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#102B49] focus:outline-none"
          aria-label="Menüyü Aç"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F2EA] border-b border-[#102B49]/10 px-8 py-8 space-y-6">
          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono tracking-widest uppercase text-[#102B49] py-2 border-b border-[#102B49]/10"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="w-full py-3.5 rounded-full bg-[#102B49] text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2"
          >
            <span>Projenizi Konuşalım</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
