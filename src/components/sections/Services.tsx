// ==========================================
// FILE: src/components/sections/Services/index.tsx
// ==========================================
import React from 'react';
import { Sparkles, Shield, MessageCircle } from 'lucide-react';
import PricingCard from './Services/PricingCard';
import { carePlans, pricingTiers, trustBadges } from './Services/data';
import CustomProjectCard from './Services/CustomProjectCard';
import CarePlanCard from './Services/CarePlanCard';
import FAQSection from './Services/FAQSection';

interface ServicesProps {
  onBookingClick: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBookingClick }) => {
  const handleCustomProject = () => {
    const message = encodeURIComponent("Hi! I'm interested in a custom Enterprise project.");
    window.open(`https://wa.me/60167093543?text=${message}`, '_blank');
  };

  return (
    <section
      id="services"
      className="py-24 bg-[#FAFAFA] dark:bg-neutral-900 overflow-hidden relative"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00ff99]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6 leading-tight">
            Stop Losing Customers to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] to-emerald-600">Ugly Websites.</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
            We build high-performance digital platforms that turn Malaysian traffic into revenue.
            Premium design, strategic copy, and real business results.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-neutral-500 font-medium">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-4 gap-6 items-end mb-24">
          {pricingTiers.map((tier, i) => (
            <PricingCard
              key={tier.title}
              {...tier}
              onSelect={onBookingClick}
              delay={i * 100}
            />
          ))}
        </div>

        {/* Custom Tier & Care Plans Split */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          <CustomProjectCard onCustomProject={handleCustomProject} />

          {/* Care Plans Intro */}
          <div className="bg-[#00ff99] rounded-3xl p-10 flex flex-col justify-center text-neutral-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield size={120} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Don't let your investment rot.</h3>
            <p className="font-medium mb-6 relative z-10">
              Websites need care. Security updates, backups, and content changes. Let us handle the boring stuff.
            </p>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 font-bold"><Shield size={16} /> Daily Backups</div>
              <div className="flex items-center gap-2 font-bold"><Shield size={16} /> Malware Scanning</div>
              <div className="flex items-center gap-2 font-bold"><Shield size={16} /> Content Updates</div>
            </div>
          </div>
        </div>

        {/* Detailed Care Plans */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-10">Recurring Care Plans</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {carePlans.map((plan) => (
              <CarePlanCard key={plan.title} {...plan} onSelect={onBookingClick} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </div>
    </section>
  );
};

export default Services;