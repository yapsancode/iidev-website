"use client"
import CTA from '@/components/sections/CTA';
import Footer from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import Portfolio from '@/components/sections/Portfolio';
import Problems from '@/components/sections/Problems';
import Services from '@/components/sections/Services';
import Team from '@/components/sections/Team';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import React from 'react';

const App: React.FC = () => {
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <main className="flex-grow">
        <Hero />
        <Problems />
        <Portfolio />
        <Team />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;