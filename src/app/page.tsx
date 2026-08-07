"use client";

import React, { useState } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { Statistics } from "@/components/sections/Statistics";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const handleOpenQuote = () => setIsQuoteOpen(true);
  const handleCloseQuote = () => setIsQuoteOpen(false);

  return (
    <>
      {/* Initial Architectural Loading Overlay */}
      <LoadingScreen />

      {/* Main Page Layout */}
      <div className="min-h-screen flex flex-col bg-[#F6F2EA] text-[#171717] relative">
        {/* Navigation Bar */}
        <Navbar onOpenQuote={handleOpenQuote} />

        {/* Main Content Sections */}
        <main className="flex-grow">
          <Hero onOpenQuote={handleOpenQuote} />
          <Philosophy />
          <Services onOpenQuote={handleOpenQuote} />
          <Projects />
          <Process />
          <Statistics />
          <ContactCTA onOpenQuote={handleOpenQuote} />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Quote / Proposal Request Modal */}
        <QuoteModal isOpen={isQuoteOpen} onClose={handleCloseQuote} />
      </div>
    </>
  );
}
