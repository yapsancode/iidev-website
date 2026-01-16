// ==========================================
// FILE: src/components/sections/Services.tsx
// ==========================================
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Shield, MessageCircle, X } from 'lucide-react';
import PricingCard from './Services/PricingCard';
import { carePlans, pricingTiers, trustBadges } from './Services/data';
import CustomProjectCard from './Services/CustomProjectCard';
import CarePlanCard from './Services/CarePlanCard';
import FAQSection from './Services/FAQSection';

interface ServicesProps {
  onBookingClick: () => void;
}

const Services: React.FC<ServicesProps> = ({ onBookingClick }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasShownDialog) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setShowDialog(true);
              setHasShownDialog(true);
            }, 500);

            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
            observer.disconnect();
          }
        });
      },
      // Use threshold 0 with rootMargin to reliably trigger when content enters view
      // -100px means it triggers when 100px of the element is visible
      { threshold: 0, rootMargin: '0px 0px -100px 0px' }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
      observer.disconnect();
    };
  }, [hasShownDialog]);

  const handleCustomProject = () => {
    const message = encodeURIComponent("Hi! I'm interested in a custom Enterprise project.");
    window.open(`https://wa.me/60167093543?text=${message}`, '_blank');
  };

  return (
    <section
      ref={sectionRef}
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
            Turn Your Website Into a Sales Asset <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] to-emerald-600">Not Just a Brochure.</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-8">
            We partner with Malaysian businesses to design fast, conversion-focused websites that build trust, attract leads, and support real growth.
            Strategy first. Design with purpose. Built to scale.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-neutral-500 font-medium mb-6">
            {trustBadges.map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </div>

          {/* Transparent Pricing Notice */}
          <div className="text-center space-y-2">
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              Transparent starting prices — final scope is confirmed after a free strategy call.
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              Every project is tailored to your business goals, not boxed into templates.
            </p>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-24">
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
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white text-center mb-4">Recurring Care Plans</h3>
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10">
            Ongoing support is optional and can be added after launch.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {carePlans.map((plan) => (
              <CarePlanCard key={plan.title} {...plan} onSelect={onBookingClick} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />
      </div>

      {/* Early Partner Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00ff99] to-emerald-600 rounded-full flex items-center justify-center">
                <Sparkles className="text-neutral-900" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Early Partner Offer
              </h3>
            </div>

            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
              We're onboarding a limited number of early partners at special rates in exchange for close collaboration and feedback.
            </p>

            <button
              onClick={() => {
                setShowDialog(false);
                onBookingClick();
              }}
              className="w-full bg-gradient-to-r from-[#00ff99] to-emerald-600 text-neutral-900 font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Book Your Free Strategy Call
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;