// ==========================================
// FILE: src/components/sections/Services/data.ts
// ==========================================
import React from 'react';
import { Shield, Star, Zap } from 'lucide-react';

export const trustBadges = [
    { icon: React.createElement(Shield, { size: 16, className: 'text-emerald-500' }), text: '100% Satisfaction Guarantee' },
    { icon: React.createElement(Star, { size: 16, className: 'text-yellow-500' }), text: '50+ Malaysian Businesses' },
    { icon: React.createElement(Zap, { size: 16, className: 'text-blue-500' }), text: 'SSM Registered Partner' }
];

export const pricingTiers = [
    {
        title: 'The Launchpad',
        price: '2,888',
        regularPrice: '3,888',
        description: 'Perfect for new businesses needing a credible, high-converting start.',
        timeline: '2 Weeks',
        isBeta: true,
        features: [
            '5-Page High-Performance Site',
            'Mobile-First Responsive Design',
            'Basic SEO (Google Maps + Indexing)',
            'WhatsApp & Lead Form Integration',
            'CMS for Easy Content Updates',
            'Hosting & Domain Included (1st Year)'
        ]
    },
    {
        title: 'Growth Engine',
        price: '4,388',
        regularPrice: '7,888',
        description: 'The standard for businesses ready to scale and dominate their local market.',
        timeline: '3-4 Weeks',
        isPopular: true,
        isBeta: true,
        features: [
            'Everything in Launchpad +',
            'Up to 12 Custom Designed Pages',
            'Advanced SEO (Keyword Research)',
            'Conversion Rate Optimization Layouts',
            'Blog / News Section',
            'Speed Optimization (< 2s load)',
            'Google Analytics 4 Dashboard'
        ]
    },
    {
        title: 'The Authority',
        price: '7,388',
        regularPrice: '12,888',
        description: 'For market leaders who need to showcase dominance and trust.',
        timeline: '5-6 Weeks',
        isBeta: true,
        features: [
            'Everything in Growth Engine +',
            'Unlimited Pages (within reason)',
            'Premium Brand Identity Refinement',
            'Interactive Animations & Motion',
            'CRM Integration (HubSpot/Zoho)',
            'Automated Email Sequence Setup',
            'Priority Support (1 Month)'
        ]
    },
    {
        title: 'E-Commerce Pro',
        price: '11,888',
        regularPrice: '19,888',
        description: 'A sales machine that works while you sleep.',
        timeline: '6-8 Weeks',
        isBeta: true,
        features: [
            'Full E-Commerce (WooCommerce)',
            'Up to 50 Products Uploaded',
            'Payment Gateway (Stripe/FPX)',
            'Abandoned Cart Recovery System',
            'Customer Account Portal',
            'Inventory Management Setup',
            'Sales Dashboard & Reporting'
        ]
    }
];

export const carePlans = [
    {
        title: 'Essential Care',
        price: '200',
        features: ['Secure Cloud Hosting', 'Daily Backups', 'Plugin & Core Updates', 'Uptime Monitoring']
    },
    {
        title: 'Growth Partner',
        price: '600',
        isRecommended: true,
        features: ['Everything in Essential +', '2 Hours Dev/Content Time', 'Monthly Performance Report', 'Speed Optimization Checks']
    },
    {
        title: 'Scale Elite',
        price: '1,200',
        features: ['Everything in Growth +', '5 Hours Dev/Content Time', 'Quarterly Strategy Call', 'SEO Monitoring & Tweaks']
    }
];

export const faqs = [
    {
        question: "Why are you more expensive than the RM 500 freelancers?",
        answer: "We don't just 'build a website'. We build a digital asset designed to generate revenue. Our pricing reflects the strategic planning, premium design, SEO foundation, and reliability that cheap freelancers simply cannot provide. You're paying for business outcomes, not just code."
    },
    {
        question: "How long does it take to launch?",
        answer: "It depends on the package. Our Launchpad sites can be live in 2 weeks, while Growth and Authority projects typically take 3-6 weeks. We provide a detailed timeline before we start so you know exactly what to expect."
    },
    {
        question: "Do I own the website?",
        answer: "Yes, 100%. Once the project is paid for, you own the domain, the hosting account, and all the code. We don't hold your site hostage."
    },
    {
        question: "Can I pay in installments?",
        answer: "Yes! We offer a 3-month interest-free payment plan for all packages above RM 5,000 to help with your cash flow."
    },
    {
        question: "What if I don't like the design?",
        answer: "We have a rigorous design process. We start with a mood board and style guide for your approval before building. You also get 2 rounds of revisions at each stage to ensure you love the final result."
    }
];