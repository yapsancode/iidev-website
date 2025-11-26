"use client"
import React, { useState } from 'react';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/sections/Navbar';
import Portfolio from '@/components/sections/Portfolio';
import Problems from '@/components/sections/Problems';
import Services from '@/components/sections/Services';
import Team from '@/components/sections/Team';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import { BookingModal } from '@/components/modal/BookingModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBooking = () => {
    setIsModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="grow">
        <section id="home"><Hero onBookingClick={handleOpenBooking} /></section>
        <section id="problems"><Problems /></section>
        <section id="why-us"><WhyChooseUs /></section>
        <section id="portfolio"><Portfolio /></section>
        <section id="team"><Team /></section>
        <section id="services"><Services onBookingClick={handleOpenBooking} /></section>
        <section id="demo"><CTA onBookingClick={handleOpenBooking} /></section>
      </main>
      <Footer />

      {/* Global Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={handleCloseBooking} />
    </div>
  );
};

export default App;