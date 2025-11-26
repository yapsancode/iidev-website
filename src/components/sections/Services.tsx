import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onBookingClick: () => void;
}

const ServiceCard: React.FC<{
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  isActive?: boolean; // New prop for interaction
  isDimmed?: boolean; // New prop for interaction
  oneTime?: boolean;
  onGetStarted: () => void;
}> = ({ title, price, description, features, recommended, isActive, isDimmed, oneTime, onGetStarted }) => (
  <div
    className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 ease-out ${isActive
        ? 'border-neutral-900 bg-white shadow-2xl scale-105 z-10 ring-1 ring-neutral-900/5'
        : isDimmed
          ? 'border-neutral-100 bg-neutral-50/50 shadow-none opacity-60 scale-95 z-0'
          : 'border-neutral-200 bg-white shadow-sm hover:border-emerald-200'
      }`}
  >
    {recommended && !isActive && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
        Most Popular
      </div>
    )}
    {isActive && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-xl animate-fade-in">
        Recommended For You
      </div>
    )}

    <div className="mb-6">
      <h3 className={`text-2xl font-bold mb-2 ${isActive ? 'text-neutral-900' : 'text-neutral-700'}`}>{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${isActive ? 'text-neutral-900' : 'text-neutral-900'}`}>RM {price}</span>
        {oneTime && !price.includes('mo') && (
          <span className="text-neutral-500 text-sm font-medium">one-time</span>
        )}
      </div>
    </div>

    <p className="text-neutral-600 text-sm mb-8 leading-relaxed min-h-[60px]">{description}</p>

    <div className="flex-grow space-y-4 mb-10">
      {features.map((feature, i) => (
        <div key={i} className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${isActive ? 'bg-neutral-900 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}
          >
            <Check size={14} strokeWidth={3} />
          </div>
          <span className={`text-sm ${isActive ? 'text-neutral-900 font-medium' : 'text-neutral-600'}`}>{feature}</span>
        </div>
      ))}
    </div>

    <button
      onClick={onGetStarted}
      className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isActive
          ? 'bg-neutral-900 text-white hover:bg-black shadow-lg hover:shadow-xl active:scale-95'
          : 'bg-white border-2 border-neutral-200 text-neutral-900 hover:border-neutral-900 active:scale-95'
        }`}
    >
      Get Started
      {isActive && <ArrowRight size={16} />}
    </button>
  </div>
);

const Services: React.FC<ServicesProps> = ({ onBookingClick }) => {
  const [sliderValue, setSliderValue] = useState(30); // 0 to 100
  const [activePlan, setActivePlan] = useState<'starter' | 'growth' | 'custom'>('starter');

  // Metric States
  const [estimatedPages, setEstimatedPages] = useState('1-5 Pages');
  const [estimatedCost, setEstimatedCost] = useState('2,800');
  const [estimatedTime, setEstimatedTime] = useState('~2 Weeks');

  // Handle Logic based on slider
  useEffect(() => {
    if (sliderValue < 40) {
      setActivePlan('starter');
      setEstimatedPages('1-5 Pages');
      setEstimatedCost('2,800');
      setEstimatedTime('~10 Days');
    } else if (sliderValue >= 40 && sliderValue < 80) {
      setActivePlan('growth');
      setEstimatedPages('6-12 Pages');
      setEstimatedCost('5,800');
      setEstimatedTime('~3 Weeks');
    } else {
      setActivePlan('custom');
      setEstimatedPages('12+ Pages');
      setEstimatedCost('9,800+');
      setEstimatedTime('1-2 Months');
    }
  }, [sliderValue]);

  const handleCustomProject = () => {
    const message = encodeURIComponent("Hi! I have a custom project I'd like to discuss");
    window.open(`https://wa.me/60167093543?text=${message}`, '_blank');
  };

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-sm font-medium mb-6">
            Pricing Calculator
          </div>
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 mb-6">
            Transparent pricing<br />
            <span className="text-neutral-400">for every stage.</span>
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">
            No hidden fees, no surprise retainers. Just a clear one-time investment to get your professional presence online.
          </p>
        </div>

        {/* Interactive Calculator */}
        <div className="bg-neutral-50 rounded-[2.5rem] p-8 md:p-12 mb-16 border border-neutral-100">
          <div className="max-w-4xl mx-auto">

            {/* Slider Label */}
            <div className="flex justify-between items-end mb-10">
              <label className="text-2xl font-medium text-neutral-900">
                Estimate your project scale
              </label>
              <div className="hidden md:block text-right">
                <span className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">Recommended Plan</span>
                <div className="text-emerald-600 font-bold text-xl capitalize">{activePlan} Site</div>
              </div>
            </div>

            {/* Custom Range Slider */}
            <div className="relative h-16 flex items-center mb-16 group cursor-grab active:cursor-grabbing">
              {/* Track Background */}
              <div className="absolute w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 transition-all duration-75 ease-out"
                  style={{ width: `${sliderValue}%` }}
                />
              </div>

              {/* Interaction Layer (Input) */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
              />

              {/* Custom Thumb Handle */}
              <div
                className="absolute h-10 w-10 bg-black rounded-full shadow-2xl border-4 border-white flex items-center justify-center z-10 pointer-events-none transition-all duration-75 ease-out"
                style={{ left: `calc(${sliderValue}% - 20px)` }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>

              {/* Floating Value Indicator (Above Thumb) */}
              <div
                className="absolute -top-10 px-3 py-1 bg-black text-white text-xs font-bold rounded-lg transform -translate-x-1/2 transition-all duration-75 ease-out opacity-0 group-hover:opacity-100"
                style={{ left: `${sliderValue}%` }}
              >
                {sliderValue}%
              </div>
            </div>

            {/* Dynamic Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-neutral-200 pt-10">
              {/* Metric 1 */}
              <div>
                <div className="text-neutral-500 text-sm font-medium mb-1">Project Scope</div>
                <div className="text-3xl md:text-4xl font-medium text-neutral-900 tracking-tight transition-all duration-300">
                  {estimatedPages}
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="text-neutral-500 text-sm font-medium mb-1">Estimated Cost</div>
                <div className="flex items-baseline gap-1 transition-all duration-300">
                  <span className="text-lg text-neutral-400 font-medium">RM</span>
                  <span className="text-3xl md:text-4xl font-medium text-neutral-900 tracking-tight">{estimatedCost}</span>
                  {activePlan === 'custom' && <span className="text-neutral-400 text-xl">+</span>}
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="text-neutral-500 text-sm font-medium mb-1">Typical Timeline</div>
                <div className="text-3xl md:text-4xl font-medium text-emerald-600 tracking-tight transition-all duration-300">
                  {estimatedTime}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10 items-start">

          {/* Starter */}
          <ServiceCard
            title="Starter Site"
            price="2,800"
            description="Perfect for small businesses, cafes, contractors, or personal brands who want to get online fast."
            oneTime={true}
            isActive={activePlan === 'starter'}
            isDimmed={activePlan !== 'starter'}
            features={[
              'Up to 5 pages',
              'Mobile-responsive WordPress',
              'Basic SEO + Google Maps',
              'Contact form + WhatsApp button',
              '1 year domain + hosting included',
              'Launch in 10–14 days',
            ]}
            onGetStarted={onBookingClick}
          />

          {/* Growth */}
          <ServiceCard
            title="Growth Site"
            price="5,800"
            description="Ideal for growing businesses that need e-commerce, booking, or stronger online presence."
            oneTime={true}
            isActive={activePlan === 'growth'}
            isDimmed={activePlan !== 'growth'}
            features={[
              'Up to 12 pages',
              'Blog or news section',
              'Basic e-commerce (up to 15 products)',
              'Booking system integration',
              'Speed optimization (<3s load)',
              '3 months free maintenance',
            ]}
            onGetStarted={onBookingClick}
          />

          {/* Custom / Enterprise (Replacing Care Plan in the main visual flow to match slider logic, move Care Plan to bottom or separate) */}
          <ServiceCard
            title="Custom Build"
            price="9,800+"
            description="For platforms, web apps, or large corporate sites requiring complex integrations."
            oneTime={true}
            isActive={activePlan === 'custom'}
            isDimmed={activePlan !== 'custom'}
            features={[
              'Unlimited pages & custom features',
              'Advanced Web App (React/Next.js)',
              'Complex API Integrations',
              'Multi-language support',
              'Custom Dashboard development',
              'Dedicated project manager',
            ]}
            onGetStarted={handleCustomProject}
          />
        </div>

        {/* Maintenance / Care Plan Add-on Section */}
        <div className="mt-20 border-t border-neutral-100 pt-16">
          <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-yellow-400" size={24} />
                <h3 className="text-2xl font-bold">Need ongoing peace of mind?</h3>
              </div>
              <p className="text-neutral-400 text-lg mb-6">
                Add our <span className="text-white font-semibold">Care Plan</span> for just <span className="text-white font-bold">RM 350/mo</span>.
                Includes monthly backups, security monitoring, priority support, and 2 hours of content updates every month.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Security Updates', 'Daily Backups', 'Priority Support', 'Cancel Anytime'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-1.5 text-sm text-neutral-300">
                    <Check size={12} /> {item}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={onBookingClick}
              className="whitespace-nowrap bg-white text-neutral-900 px-8 py-4 rounded-xl font-bold hover:bg-neutral-200 transition-colors active:scale-95"
            >
              Add Care Plan
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400 text-sm">
            * Domain & hosting renewals for standard sites are approximately RM 488/year after the first year.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Services;
