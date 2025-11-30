import React, { useState } from 'react';
import { Check, X, Sparkles, ArrowRight, Star, Shield, Zap, Clock, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

interface ServicesProps {
  onBookingClick: () => void;
}

const PricingCard: React.FC<{
  title: string;
  price: string;
  regularPrice: string;
  description: string;
  features: string[];
  timeline: string;
  isPopular?: boolean;
  isBeta?: boolean;
  delay?: number;
  onSelect: () => void;
}> = ({ title, price, regularPrice, description, features, timeline, isPopular, isBeta, delay, onSelect }) => (
  <div
    className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 group ${isPopular
        ? 'bg-neutral-900 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 scale-105 z-10'
        : 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/10'
      }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00ff99] text-neutral-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(0,255,153,0.4)]">
        Most Popular
      </div>
    )}

    {isBeta && (
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Beta Pricing
      </div>
    )}

    <div className="mb-6 mt-2">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm h-[40px] leading-relaxed">{description}</p>
    </div>

    <div className="mb-8">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">RM {price}</span>
        <span className="text-neutral-600 text-lg line-through decoration-red-500/50">RM {regularPrice}</span>
      </div>
      <div className="text-[#00ff99] text-xs font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
        <Clock size={12} /> {timeline} Delivery
      </div>
    </div>

    <div className="flex-grow space-y-4 mb-8">
      {features.map((feature, i) => (
        <div key={i} className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300">
          <div className="mt-0.5 rounded-full bg-[#00ff99]/10 p-0.5 flex-shrink-0 text-[#00ff99]">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm text-neutral-300">{feature}</span>
        </div>
      ))}
    </div>

    <button
      onClick={onSelect}
      className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isPopular
          ? 'bg-[#00ff99] text-neutral-900 hover:bg-[#00cc7a] shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:shadow-[0_0_30px_rgba(0,255,153,0.5)]'
          : 'bg-white text-neutral-900 hover:bg-neutral-200'
        } active:scale-95`}
    >
      {isBeta ? 'Claim Beta Spot' : 'Book Fit Call'}
      <ArrowRight size={16} />
    </button>
  </div>
);

const CarePlanCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
  onSelect: () => void;
}> = ({ title, price, features, isRecommended, onSelect }) => (
  <div className={`p-6 rounded-2xl border ${isRecommended ? 'bg-neutral-800 border-[#00ff99]/30 relative' : 'bg-neutral-900 border-neutral-800'}`}>
    {isRecommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff99] text-neutral-900 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase">
        Recommended
      </div>
    )}
    <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
    <div className="text-2xl font-bold text-white mb-4">RM {price}<span className="text-sm text-neutral-500 font-normal">/mo</span></div>
    <ul className="space-y-3 mb-6">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-neutral-400">
          <Check size={14} className="text-[#00ff99]" /> {f}
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      className={`w-full py-2 rounded-lg text-sm font-bold border ${isRecommended ? 'bg-[#00ff99]/10 border-[#00ff99] text-[#00ff99]' : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'}`}
    >
      Add Plan
    </button>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-neutral-800">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-white">{question}</span>
        {isOpen ? <ChevronUp className="text-neutral-500" /> : <ChevronDown className="text-neutral-500" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6' : 'max-h-0'}`}>
        <p className="text-neutral-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const Services: React.FC<ServicesProps> = ({ onBookingClick }) => {
  const handleCustomProject = () => {
    const message = encodeURIComponent("Hi! I'm interested in a custom Enterprise project.");
    window.open(`https://wa.me/60167093543?text=${message}`, '_blank');
  };

  return (
    <section id="services" className="py-24 bg-black overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#00ff99]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Hero Section */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-[#00ff99] text-sm font-medium mb-6">
            <Sparkles size={14} />
            <span>2026 Premium Agency Positioning</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Stop Losing Customers to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff99] to-emerald-600">Ugly Websites.</span>
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8">
            We build high-performance digital platforms that turn Malaysian traffic into revenue.
            Premium design, strategic copy, and real business results.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-neutral-500 font-medium">
            <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-500" /> 100% Satisfaction Guarantee</div>
            <div className="flex items-center gap-2"><Star size={16} className="text-yellow-500" /> 50+ Malaysian Businesses</div>
            <div className="flex items-center gap-2"><Zap size={16} className="text-blue-500" /> SSM Registered Partner</div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-4 gap-6 items-end mb-24">
          {/* Tier 1: Launchpad */}
          <PricingCard
            title="The Launchpad"
            price="3,800"
            regularPrice="5,800"
            description="Perfect for new businesses needing a credible, high-converting start."
            timeline="2 Weeks"
            isBeta={true}
            features={[
              '5-Page High-Performance Site',
              'Mobile-First Responsive Design',
              'Basic SEO (Google Maps + Indexing)',
              'WhatsApp & Lead Form Integration',
              'CMS for Easy Content Updates',
              'Hosting & Domain Included (1st Year)'
            ]}
            onSelect={onBookingClick}
            delay={0}
          />

          {/* Tier 2: Growth Engine */}
          <PricingCard
            title="Growth Engine"
            price="7,800"
            regularPrice="12,800"
            description="The standard for businesses ready to scale and dominate their local market."
            timeline="3-4 Weeks"
            isPopular={true}
            isBeta={true}
            features={[
              'Everything in Launchpad +',
              'Up to 12 Custom Designed Pages',
              'Advanced SEO (Keyword Research)',
              'Conversion Rate Optimization Layouts',
              'Blog / News Section',
              'Speed Optimization (< 2s load)',
              'Google Analytics 4 Dashboard'
            ]}
            onSelect={onBookingClick}
            delay={100}
          />

          {/* Tier 3: The Authority */}
          <PricingCard
            title="The Authority"
            price="15,800"
            regularPrice="22,000"
            description="For market leaders who need to showcase dominance and trust."
            timeline="5-6 Weeks"
            isBeta={true}
            features={[
              'Everything in Growth Engine +',
              'Unlimited Pages (within reason)',
              'Premium Brand Identity Refinement',
              'Interactive Animations & Motion',
              'CRM Integration (HubSpot/Zoho)',
              'Automated Email Sequence Setup',
              'Priority Support (1 Month)'
            ]}
            onSelect={onBookingClick}
            delay={200}
          />

          {/* Tier 4: E-Commerce Pro */}
          <PricingCard
            title="E-Commerce Pro"
            price="18,800"
            regularPrice="28,000"
            description="A sales machine that works while you sleep."
            timeline="6-8 Weeks"
            isBeta={true}
            features={[
              'Full E-Commerce (WooCommerce)',
              'Up to 50 Products Uploaded',
              'Payment Gateway (Stripe/FPX)',
              'Abandoned Cart Recovery System',
              'Customer Account Portal',
              'Inventory Management Setup',
              'Sales Dashboard & Reporting'
            ]}
            onSelect={onBookingClick}
            delay={300}
          />
        </div>

        {/* Custom Tier & Care Plans Split */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {/* Custom Tier */}
          <div className="lg:col-span-2 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-10 border border-neutral-800 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-block bg-white text-black px-3 py-1 rounded-md text-xs font-bold uppercase mb-4">Enterprise</div>
              <h3 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h3>
              <p className="text-neutral-400 mb-6">
                For platforms, web apps (Next.js/React), SaaS MVP, or large corporate sites requiring complex API integrations and dedicated project management.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['Custom Web Apps', 'SaaS Development', 'Complex APIs', 'Multi-language'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-neutral-950 rounded-full text-xs text-neutral-400 border border-neutral-800">{tag}</span>
                ))}
              </div>
              <button onClick={handleCustomProject} className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                Discuss Your Project
              </button>
            </div>
            <div className="w-full md:w-1/3 border-l border-neutral-700/50 pl-0 md:pl-10 flex flex-col justify-center">
              <div className="text-neutral-500 text-sm font-medium mb-1">Starting from</div>
              <div className="text-4xl font-bold text-white mb-2">RM 35k+</div>
              <div className="text-neutral-400 text-sm">Timeline: 2-3 Months+</div>
            </div>
          </div>

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
              <div className="flex items-center gap-2 font-bold"><Check size={16} /> Daily Backups</div>
              <div className="flex items-center gap-2 font-bold"><Check size={16} /> Malware Scanning</div>
              <div className="flex items-center gap-2 font-bold"><Check size={16} /> Content Updates</div>
            </div>
          </div>
        </div>

        {/* Detailed Care Plans */}
        <div className="mb-24">
          <h3 className="text-2xl font-bold text-white text-center mb-10">Recurring Care Plans</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CarePlanCard
              title="Essential Care"
              price="350"
              features={['Secure Cloud Hosting', 'Daily Backups', 'Plugin & Core Updates', 'Uptime Monitoring']}
              onSelect={onBookingClick}
            />
            <CarePlanCard
              title="Growth Partner"
              price="850"
              isRecommended={true}
              features={['Everything in Essential +', '2 Hours Dev/Content Time', 'Monthly Performance Report', 'Speed Optimization Checks']}
              onSelect={onBookingClick}
            />
            <CarePlanCard
              title="Scale Elite"
              price="1,800"
              features={['Everything in Growth +', '5 Hours Dev/Content Time', 'Quarterly Strategy Call', 'SEO Monitoring & Tweaks']}
              onSelect={onBookingClick}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <h3 className="text-3xl font-bold text-white text-center mb-10">Common Questions</h3>
          <div className="space-y-2">
            <FAQItem
              question="Why are you more expensive than the RM 500 freelancers?"
              answer="We don't just 'build a website'. We build a digital asset designed to generate revenue. Our pricing reflects the strategic planning, premium design, SEO foundation, and reliability that cheap freelancers simply cannot provide. You're paying for business outcomes, not just code."
            />
            <FAQItem
              question="How long does it take to launch?"
              answer="It depends on the package. Our Launchpad sites can be live in 2 weeks, while Growth and Authority projects typically take 3-6 weeks. We provide a detailed timeline before we start so you know exactly what to expect."
            />
            <FAQItem
              question="Do I own the website?"
              answer="Yes, 100%. Once the project is paid for, you own the domain, the hosting account, and all the code. We don't hold your site hostage."
            />
            <FAQItem
              question="Can I pay in installments?"
              answer="Yes! We offer a 3-month interest-free payment plan for all packages above RM 5,000 to help with your cash flow."
            />
            <FAQItem
              question="What if I don't like the design?"
              answer="We have a rigorous design process. We start with a mood board and style guide for your approval before building. You also get 2 rounds of revisions at each stage to ensure you love the final result."
            />
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-neutral-900 rounded-[3rem] p-12 text-center border border-neutral-800 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#00ff99]/5 to-transparent pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to Dominate Your Market?</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10 relative z-10">
            Only 4 spots left for this month's beta pricing. Secure your spot now and start growing your business.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={onBookingClick}
              className="px-8 py-4 bg-[#00ff99] text-neutral-900 rounded-xl font-bold text-lg hover:bg-[#00cc7a] transition-all shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:shadow-[0_0_40px_rgba(0,255,153,0.5)] active:scale-95"
            >
              Book Your Free Strategy Call
            </button>
            <button
              onClick={() => window.open('https://wa.me/60167093543', '_blank')}
              className="px-8 py-4 bg-transparent border border-neutral-700 text-white rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all flex items-center gap-2"
            >
              <MessageCircle size={20} />
              WhatsApp Us
            </button>
          </div>
          <p className="mt-6 text-neutral-500 text-sm">
            No pressure. Just a friendly chat to see if we're a fit.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Services;
