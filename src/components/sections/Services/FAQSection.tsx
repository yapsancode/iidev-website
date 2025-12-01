// ==========================================
// FILE: src/components/sections/Services/FAQSection.tsx
// ==========================================
import React from 'react';
import FAQItem from './FAQItem';
import { faqs } from './data';

const FAQSection: React.FC = () => (
    <div className="max-w-3xl mx-auto mb-24">
        <h3 className="text-3xl font-bold text-white text-center mb-10">Common Questions</h3>
        <div className="space-y-2">
            {faqs.map((faq, i) => (
                <FAQItem key={i} {...faq} />
            ))}
        </div>
    </div>
);

export default FAQSection;