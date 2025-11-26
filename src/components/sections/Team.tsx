// 📁 components/sections/Team.tsx
"use client"
import React from 'react';
import { motion } from 'framer-motion';

const Team: React.FC = () => {
  return (
    <section id="team" className="py-24 bg-[#FAFAFA] border-y border-neutral-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center -space-x-8 mb-8"
        >
          <div className="relative">
            <img
              src="https://picsum.photos/id/64/150/150"
              alt="Founder 1"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-neutral-100 text-xs font-bold whitespace-nowrap">
              Imran Ariff
            </div>
          </div>
          <div className="relative z-10">
            <img
              src="images/isyraf-afifi.jpg"
              alt="Founder 2"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-neutral-100 text-xs font-bold whitespace-nowrap">
              Isyraf Afifi
            </div>
          </div>
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
          Just two dedicated developers building your project end-to-end. <br className="hidden md:block" /> No middlemen.
        </h2>

        <p className="text-lg text-neutral-500 leading-relaxed">
          We are a small boutique team of 2 senior developers who give personal attention that big agencies can’t. <br className="hidden md:block" />
          With <span className="text-neutral-900 font-semibold">iidev studio</span>, you work directly with the people shipping your code — and nothing else.
        </p>
      </div>
    </section>
  );
};

export default Team;