import React from 'react';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Navbar } from '@/components/sections/Navbar';
import Portfolio from '@/components/sections/Portfolio';
import FAQ from '@/components/sections/FAQ';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import ProcessTimeline from '@/components/sections/ProcessTimeline';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="grow">
        <section id="home"><Hero /></section>
        <section id="why-us"><WhyChooseUs /></section>
        <section id="process"><ProcessTimeline /></section>
        <section id="portfolio"><Portfolio /></section>
        <section id="faq"><FAQ /></section>
        <section id="demo"><CTA /></section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
