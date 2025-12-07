// ==========================================
// FILE: src/components/sections/Services/PricingCard.tsx
// ==========================================
import React from 'react';
import { Check, Clock, ArrowRight } from 'lucide-react';

interface PricingCardProps {
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
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    regularPrice,
    description,
    features,
    timeline,
    isPopular,
    isBeta,
    delay,
    onSelect
}) => (
    <div
        className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-500 group ${isPopular
            ? 'bg-neutral-900 dark:bg-neutral-900 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 scale-105 z-10'
            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-900/10'
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
            <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{title}</h3>
            <p className={`text-sm h-[40px] leading-relaxed ${isPopular ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>{description}</p>
        </div>

        <div className="mb-8">
            <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>RM {price}</span>
                <span className="text-neutral-400 dark:text-neutral-600 text-lg line-through decoration-red-500/50">RM {regularPrice}</span>
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
                    <span className={`text-sm ${isPopular ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-300'}`}>{feature}</span>
                </div>
            ))}
        </div>

        <button
            onClick={onSelect}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isPopular
                ? 'bg-[#00ff99] text-neutral-900 hover:bg-[#00cc7a] shadow-[0_0_20px_rgba(0,255,153,0.3)] hover:shadow-[0_0_30px_rgba(0,255,153,0.5)]'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'
                } active:scale-95`}
        >
            {isBeta ? 'Claim Beta Spot' : 'Book Fit Call'}
            <ArrowRight size={16} />
        </button>
    </div>
);

export default PricingCard;