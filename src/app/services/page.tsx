"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { BookingModal } from "@/components/modal/BookingModal";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="grow pt-24 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Services
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl">
            A full breakdown of what we offer and how we work.
          </p>
        </div>
      </main>
      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
