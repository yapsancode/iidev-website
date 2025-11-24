"use client"
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/sections/Navbar';
import Portfolio from '@/components/sections/Portfolio';
import Problems from '@/components/sections/Problems';
import Services from '@/components/sections/Services';
import Team from '@/components/sections/Team';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import React from 'react';

// App.tsx
const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="grow">
        <section id="home"><Hero /></section>
        <section id="problems"><Problems /></section>
        <section id="why-us"><WhyChooseUs /></section>
        <section id="portfolio"><Portfolio /></section>
        <section id="team"><Team /></section>
        <section id="services"><Services /></section>
        <section id="demo"><CTA /></section>
      </main>
      <Footer />
    </div>
  );
};

export default App;