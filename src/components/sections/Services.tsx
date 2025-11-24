// 📁 components/sections/Services.tsx
import React from 'react';
import { Check } from 'lucide-react';

const ServiceCard: React.FC<{
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}> = ({ title, price, description, features, recommended }) => (
  <div className={`relative flex flex-col p-8 rounded-3xl border ${recommended ? 'border-emerald-500 bg-white shadow-2xl scale-105 z-10' : 'border-neutral-200 bg-white shadow-sm hover:border-emerald-200'} transition-all duration-300`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-3xl font-bold text-neutral-900">{price}</span>
      {price !== 'Custom' && <span className="text-neutral-500 text-sm">/ starting at</span>}
    </div>
    <p className="text-neutral-500 text-sm mb-8 leading-relaxed">{description}</p>
    
    <div className="flex-grow space-y-4 mb-8">
      {features.map((feature, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-full p-0.5 ${recommended ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-600'}`}>
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="text-sm text-neutral-700">{feature}</span>
        </div>
      ))}
    </div>
    
    <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
      recommended 
        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-200' 
        : 'bg-neutral-900 text-white hover:bg-neutral-800'
    }`}>
      Choose Plan
    </button>
  </div>
);

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-neutral-500 text-lg">
            Invest in your business, not hourly billing confusion.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <ServiceCard
            title="Redesign & Performance"
            price="$3,500"
            description="Perfect for existing sites that need a facelift and a speed boost."
            features={[
              "Complete UI/UX Overhaul",
              "Next.js Migration",
              "95+ Google Lighthouse Score",
              "SEO Optimization",
              "2 Weeks Turnaround"
            ]}
          />
          <ServiceCard
            title="Full Website Build"
            price="$5,000"
            description="A complete custom website built from scratch for maximum impact."
            recommended={true}
            features={[
              "Custom Design System",
              "CMS Integration (Sanity/Strapi)",
              "Interactive Animations",
              "Advanced SEO Setup",
              "Analytics Dashboard",
              "1 Month Support Included"
            ]}
          />
          <ServiceCard
            title="Growth Retainer"
            price="$1,200"
            description="Monthly dedicated development time to keep growing your site."
            features={[
              "20 Hours Dev Time / Month",
              "Priority Support",
              "A/B Testing Implementation",
              "New Landing Pages",
              "Performance Monitoring",
              "Cancel Anytime"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;