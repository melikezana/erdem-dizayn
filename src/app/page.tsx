"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppointmentModal } from "@/components/ui/AppointmentModal";
import { ProjectTrackingModal } from "@/components/ui/ProjectTrackingModal";
import { ConversionActions } from "@/components/ui/ConversionActions";
import { Hero } from "@/components/sections/Hero";
import { StatementOne } from "@/components/sections/StatementOne";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { ProjectTrackingTeaser } from "@/components/sections/ProjectTrackingTeaser";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isProjectTrackingOpen, setIsProjectTrackingOpen] = useState(false);

  const handleOpenAppointment = () => setIsAppointmentOpen(true);
  const handleCloseAppointment = () => setIsAppointmentOpen(false);
  const handleOpenProjectTracking = () => setIsProjectTrackingOpen(true);
  const handleCloseProjectTracking = () => setIsProjectTrackingOpen(false);
  const handleOpenAppointmentFromTracking = () => {
    setIsProjectTrackingOpen(false);
    setIsAppointmentOpen(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F6F2EA] text-[#171717] selection:bg-[#9A5C2F] selection:text-white">
      <Navbar
        onOpenAppointment={handleOpenAppointment}
        onOpenProjectTracking={handleOpenProjectTracking}
      />

      <main className="relative z-10 flex-grow">
        <Hero onOpenAppointment={handleOpenAppointment} />
        <StatementOne />
        <Services onOpenAppointment={handleOpenAppointment} />
        <Projects onOpenAppointment={handleOpenAppointment} />
        <Process />
        <ProjectTrackingTeaser onOpenProjectTracking={handleOpenProjectTracking} />
        <ContactCTA onOpenAppointment={handleOpenAppointment} />
      </main>

      <Footer />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={handleCloseAppointment}
      />
      <ProjectTrackingModal
        isOpen={isProjectTrackingOpen}
        onClose={handleCloseProjectTracking}
        onOpenAppointment={handleOpenAppointmentFromTracking}
      />
      <ConversionActions onOpenAppointment={handleOpenAppointment} />
    </div>
  );
}
