"use client";

import React, { useState } from "react";
import { OpeningIntro } from "@/components/ui/OpeningIntro";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { Hero } from "@/components/sections/Hero";
import { StatementOne } from "@/components/sections/StatementOne";
import { TechnicalReveal } from "@/components/sections/TechnicalReveal";
import { StatementTwo } from "@/components/sections/StatementTwo";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isTechnicalMode, setIsTechnicalMode] = useState(false);

  const handleOpenQuote = () => setIsQuoteOpen(true);
  const handleCloseQuote = () => setIsQuoteOpen(false);

  return (
    <>
      {/* 1. Cinematic Opening Intro Sequence */}
      <OpeningIntro />

      {/* Main Page Container */}
      <div className="min-h-screen flex flex-col bg-[#F6F2EA] text-[#171717] relative selection:bg-[#9A5C2F] selection:text-white">
        {/* Navigation Bar */}
        <Navbar onOpenQuote={handleOpenQuote} />

        {/* Editorial Scroll Narrative */}
        <main className="relative z-10 flex-grow">
          {/* Hero Section */}
          <Hero isTechnicalMode={isTechnicalMode} />

          {/* Statement 01 */}
          <StatementOne />

          {/* Technical Reveal / Blueprint View */}
          <TechnicalReveal
            isTechnicalMode={isTechnicalMode}
            setIsTechnicalMode={setIsTechnicalMode}
          />

          {/* Statement 02 */}
          <StatementTwo />

          {/* Editorial Services 01-08 */}
          <Services onOpenQuote={handleOpenQuote} />

          {/* Selected Projects */}
          <Projects />

          {/* Minimal Process 01-07 */}
          <Process />

          {/* Final Deep Navy CTA */}
          <ContactCTA onOpenQuote={handleOpenQuote} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Proposal / Contact Modal */}
        <QuoteModal isOpen={isQuoteOpen} onClose={handleCloseQuote} />
      </div>
    </>
  );
}
