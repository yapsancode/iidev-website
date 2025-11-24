// 📁 components/sections/Problems.tsx
"use client"
import React from 'react';
import { Gauge, Palette, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ProblemCard: React.FC<{
  icon: React.ElementType;
  title: string;
  problem: string;
  solution: string;
  delay: number;
}> = ({ icon: Icon, title, problem, solution, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative group p-8 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-red-400 mt-1">✕</span>
        <p className="text-neutral-500 text-sm">{problem}</p>
      </div>
      <div className="w-full h-px bg-neutral-100 my-2" />
      <div className="flex items-start gap-2">
        <span className="text-emerald-500 mt-1">✓</span>
        <p className="text-neutral-900 font-medium text-sm">{solution}</p>
      </div>
    </div>
  </motion.div>
);

const Problems: React.FC = () => {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            Stop losing money because of your website.
          </h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Most websites are slow, generic, and confusing. We fix that.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ProblemCard
            icon={Gauge}
            title="Performance"
            problem="Slow loading speeds kill conversions and SEO rankings."
            solution="95–100 Google Lighthouse score guaranteed."
            delay={0.1}
          />
          <ProblemCard
            icon={Palette}
            title="Design"
            problem="Generic templates that look like everyone else."
            solution="Custom, premium UI tailored to your brand."
            delay={0.2}
          />
          <ProblemCard
            icon={Users}
            title="Process"
            problem="Endless revisions and hourly billing surprises."
            solution="Fixed price, fixed timeline, unlimited revisions."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
};

export default Problems;