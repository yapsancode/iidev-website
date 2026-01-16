// ==========================================
// FILE: src/components/sections/Services/CustomProjectCard.tsx
// ==========================================
import React from 'react';

interface CustomProjectCardProps {
    onCustomProject: () => void;
}

const CustomProjectCard: React.FC<CustomProjectCardProps> = ({ onCustomProject }) => (
    <div className="lg:col-span-2 bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 rounded-3xl p-10 border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
            <div className="inline-block bg-neutral-900 text-white dark:bg-white dark:text-black px-3 py-1 rounded-md text-xs font-bold uppercase mb-4">
                Enterprise
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Need a Custom Software Solution?</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                For web platforms, SaaS MVPs, internal tools, or systems requiring complex integrations and long-term scalability.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
                {['Custom Web Apps', 'SaaS Development', 'Complex APIs', 'Multi-language'].map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white dark:bg-neutral-950 rounded-full text-xs text-neutral-700 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800">
                        {tag}
                    </span>
                ))}
            </div>
            <button
                onClick={onCustomProject}
                className="bg-neutral-900 text-white dark:bg-white dark:text-black px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
                Discuss Your Project (No Commitment)
            </button>
        </div>
        <div className="w-full md:w-1/3 border-l border-neutral-200 dark:border-neutral-700/50 pl-0 md:pl-10 flex flex-col justify-center">
            <div className="text-neutral-500 text-sm font-medium mb-1">Typically</div>
            <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">RM 35k+</div>
            <div className="text-neutral-600 dark:text-neutral-400 text-sm">Final scope depends on complexity and timeline.</div>
        </div>
    </div>
);

export default CustomProjectCard;
