// 📁 components/sections/CTA.tsx
"use client"
import React from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-emerald-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8">
            Ready to get a website that actually grows your business?
          </h2>
          <p className="text-emerald-100 text-xl mb-12 max-w-2xl mx-auto">
            Book a free 15-minute discovery call. No sales pressure, just a friendly chat about your goals.
          </p>
          
          <button className="inline-flex items-center gap-2 bg-emerald-500 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg shadow-emerald-900/20 hover:bg-emerald-400 hover:scale-105 transition-all duration-300">
            <Calendar size={20} />
            Book Your Free Call
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;