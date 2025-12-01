// ==========================================
// FILE: src/components/sections/Services/FAQItem.tsx
// ==========================================
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
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

export default FAQItem;
