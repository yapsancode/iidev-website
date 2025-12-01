// ==========================================
// FILE: src/components/sections/Services/CarePlanCard.tsx
// ==========================================
import React from 'react';
import { Check } from 'lucide-react';

interface CarePlanCardProps {
    title: string;
    price: string;
    features: string[];
    isRecommended?: boolean;
    onSelect: () => void;
}

const CarePlanCard: React.FC<CarePlanCardProps> = ({
    title,
    price,
    features,
    isRecommended,
    onSelect
}) => (
    <div className={`p-6 rounded-2xl border ${isRecommended ? 'bg-neutral-800 border-[#00ff99]/30 relative' : 'bg-neutral-900 border-neutral-800'
        }`}>
        {isRecommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff99] text-neutral-900 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase">
                Recommended
            </div>
        )}
        <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
        <div className="text-2xl font-bold text-white mb-4">
            RM {price}<span className="text-sm text-neutral-500 font-normal">/mo</span>
        </div>
        <ul className="space-y-3 mb-6">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-400">
                    <Check size={14} className="text-[#00ff99]" /> {f}
                </li>
            ))}
        </ul>
        <button
            onClick={onSelect}
            className={`w-full py-2 rounded-lg text-sm font-bold border ${isRecommended
                ? 'bg-[#00ff99]/10 border-[#00ff99] text-[#00ff99]'
                : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
        >
            Add Plan
        </button>
    </div>
);

export default CarePlanCard;